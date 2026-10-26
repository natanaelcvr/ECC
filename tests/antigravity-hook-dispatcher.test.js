'use strict';

const assert = require('assert');
const {
  translateAntigravityInput,
  formatAntigravityOutput,
  dispatchAntigravityHook,
} = require('../scripts/hooks/antigravity-hook-dispatcher');

function test(name, fn) {
  try {
    fn();
    console.log(`  \u2713 ${name}`);
    return true;
  } catch (error) {
    console.log(`  \u2717 ${name}`);
    console.error(error);
    return false;
  }
}

console.log('\n=== Testing Antigravity Hook Dispatcher ===\n');

let passed = 0;
let failed = 0;

if (test('translates run_command to shell tool call', () => {
  const agyInput = {
    toolCall: {
      name: 'run_command',
      args: {
        CommandLine: 'git status',
      },
    },
    conversationId: 'test-convo-123',
    workspacePaths: ['/workspace/my-app'],
    transcriptPath: '/workspace/my-app/transcript.jsonl',
  };

  const translated = translateAntigravityInput(agyInput, 'PreToolUse');
  assert.ok(translated.tool_name === 'Bash' || translated.tool_name === 'PowerShell');
  assert.strictEqual(translated.tool_input.command, 'git status');
  assert.strictEqual(translated.conversation_id, 'test-convo-123');
  assert.strictEqual(translated.workspace_root, '/workspace/my-app');
})) passed++; else failed++;

if (test('translates write_file to Write tool call', () => {
  const agyInput = {
    toolCall: {
      name: 'write_file',
      args: {
        Path: 'src/app.ts',
        Content: 'console.log("hello");',
      },
    },
    conversationId: 'test-convo-123',
    workspacePaths: ['/workspace/my-app'],
  };

  const translated = translateAntigravityInput(agyInput, 'PreToolUse');
  assert.strictEqual(translated.tool_name, 'Write');
  assert.strictEqual(translated.tool_input.file_path, 'src/app.ts');
  assert.strictEqual(translated.tool_input.content, 'console.log("hello");');
})) passed++; else failed++;

if (test('translates edit_file to Edit tool call', () => {
  const agyInput = {
    toolCall: {
      name: 'edit_file',
      args: {
        Path: 'src/app.ts',
        Target: 'old code',
        Replacement: 'new code',
      },
    },
    conversationId: 'test-convo-123',
  };

  const translated = translateAntigravityInput(agyInput, 'PreToolUse');
  assert.strictEqual(translated.tool_name, 'Edit');
  assert.strictEqual(translated.tool_input.file_path, 'src/app.ts');
  assert.strictEqual(translated.tool_input.old_string, 'old code');
  assert.strictEqual(translated.tool_input.new_string, 'new code');
})) passed++; else failed++;

if (test('formats allow decision for Antigravity', () => {
  const formatted = formatAntigravityOutput({ allowed: true });
  assert.strictEqual(formatted.decision, 'allow');
})) passed++; else failed++;

if (test('formats deny decision with reason for Antigravity', () => {
  const denial = {
    stdout: JSON.stringify({
      hookSpecificOutput: {
        permissionDecision: 'deny',
        permissionDecisionReason: 'GateGuard requires investigation facts before destructive deletion',
      },
    }),
  };

  const formatted = formatAntigravityOutput(denial);
  assert.strictEqual(formatted.decision, 'deny');
  assert.ok(formatted.reason.includes('GateGuard requires investigation'));
})) passed++; else failed++;

console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
if (failed > 0) process.exit(1);
