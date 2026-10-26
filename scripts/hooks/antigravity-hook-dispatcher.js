#!/usr/bin/env node
'use strict';

/**
 * Antigravity Lifecycle Hook Dispatcher
 *
 * Bridges Google Antigravity stdin/stdout JSON protocol with ECC's
 * GateGuard, safety-check, session bootstrap, and memory persistence engines.
 *
 * Supported events:
 *   - PreToolUse
 *   - PostToolUse
 *   - SessionStart
 *   - Stop
 */

const fs = require('fs');
const path = require('path');

function resolveEccRoot() {
  if (process.env.ECC_ROOT && fs.existsSync(process.env.ECC_ROOT)) {
    return process.env.ECC_ROOT;
  }
  if (process.env.ANTIGRAVITY_PLUGIN_ROOT && fs.existsSync(process.env.ANTIGRAVITY_PLUGIN_ROOT)) {
    return process.env.ANTIGRAVITY_PLUGIN_ROOT;
  }
  // Walk up from scripts/hooks
  return path.resolve(__dirname, '..', '..');
}

function translateAntigravityInput(agyPayload, eventName) {
  if (!agyPayload || typeof agyPayload !== 'object') {
    return { event: eventName, raw: agyPayload };
  }

  const toolCall = agyPayload.toolCall || {};
  const toolName = String(toolCall.name || '').toLowerCase();
  const toolArgs = toolCall.args || {};

  let normalizedToolName = toolCall.name || '';
  const toolInput = {};

  if (toolName === 'run_command') {
    normalizedToolName = process.platform === 'win32' ? 'PowerShell' : 'Bash';
    toolInput.command = toolArgs.CommandLine || toolArgs.command || '';
  } else if (toolName === 'write_file') {
    normalizedToolName = 'Write';
    toolInput.file_path = toolArgs.Path || toolArgs.path || '';
    toolInput.content = toolArgs.Content || toolArgs.content || '';
  } else if (toolName === 'edit_file') {
    normalizedToolName = 'Edit';
    toolInput.file_path = toolArgs.Path || toolArgs.path || '';
    toolInput.old_string = toolArgs.Target || toolArgs.old_string || '';
    toolInput.new_string = toolArgs.Replacement || toolArgs.new_string || '';
  } else {
    Object.assign(toolInput, toolArgs);
  }

  const workspaceRoot = Array.isArray(agyPayload.workspacePaths) && agyPayload.workspacePaths[0]
    ? agyPayload.workspacePaths[0]
    : process.cwd();

  return {
    hook_event: eventName,
    tool_name: normalizedToolName,
    tool_input: toolInput,
    conversation_id: agyPayload.conversationId || '',
    workspace_root: workspaceRoot,
    cwd: workspaceRoot,
    transcript_path: agyPayload.transcriptPath || '',
    step_idx: agyPayload.stepIdx !== undefined ? agyPayload.stepIdx : 0,
    raw_antigravity_payload: agyPayload,
  };
}

function formatAntigravityOutput(result) {
  if (!result) {
    return { decision: 'allow' };
  }

  // Check if result has standard Claude/ECC denial structure
  let denialObj = null;
  if (typeof result === 'object') {
    if (result.stdout) {
      try {
        denialObj = JSON.parse(result.stdout);
      } catch (_) {}
    } else if (result.hookSpecificOutput) {
      denialObj = result;
    }
  }

  if (denialObj && denialObj.hookSpecificOutput) {
    const specific = denialObj.hookSpecificOutput;
    const decision = specific.permissionDecision || 'allow';
    const reason = specific.permissionDecisionReason || specific.reason || 'Blocked by policy';

    if (decision === 'deny' || decision === 'ask') {
      return {
        decision,
        reason,
      };
    }
  }

  if (result.status === 'blocked' || result.blocked || result.denied) {
    return {
      decision: 'deny',
      reason: result.reason || result.message || 'Action blocked by ECC security policy',
    };
  }

  return { decision: 'allow' };
}

function dispatchAntigravityHook(eventName, agyPayload) {
  const eccRoot = resolveEccRoot();
  process.env.ECC_ROOT = eccRoot;
  process.env.CLAUDE_PLUGIN_ROOT = eccRoot;

  const translated = translateAntigravityInput(agyPayload, eventName);

  if (eventName === 'PreToolUse') {
    try {
      const gateguardPath = path.join(eccRoot, 'scripts', 'hooks', 'gateguard-fact-force.js');
      if (fs.existsSync(gateguardPath)) {
        const gateguard = require(gateguardPath);
        if (typeof gateguard.run === 'function') {
          const result = gateguard.run(translated);
          return formatAntigravityOutput(result);
        }
      }
    } catch (err) {
      // Fail open on unexpected hook engine errors to avoid locking the user out
      return { decision: 'allow' };
    }
  }

  if (eventName === 'SessionStart') {
    try {
      const sessionStartPath = path.join(eccRoot, 'scripts', 'hooks', 'session-start-bootstrap.js');
      if (fs.existsSync(sessionStartPath)) {
        const sessionBootstrap = require(sessionStartPath);
        if (typeof sessionBootstrap.run === 'function') {
          sessionBootstrap.run(translated);
        }
      }
    } catch (_) {}
    return {};
  }

  if (eventName === 'Stop') {
    // Session termination / persistence handling
    return {};
  }

  return { decision: 'allow' };
}

// CLI Execution Boundary
if (require.main === module) {
  const eventName = process.argv[2] || 'PreToolUse';
  let inputBuffer = '';

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => {
    inputBuffer += chunk;
  });

  process.stdin.on('end', () => {
    let payload = {};
    if (inputBuffer.trim()) {
      try {
        payload = JSON.parse(inputBuffer);
      } catch (_) {
        payload = {};
      }
    }

    const output = dispatchAntigravityHook(eventName, payload);
    if (output && Object.keys(output).length > 0) {
      process.stdout.write(JSON.stringify(output) + '\n');
    }
    process.exit(0);
  });
}

module.exports = {
  dispatchAntigravityHook,
  translateAntigravityInput,
  formatAntigravityOutput,
  resolveEccRoot,
};
