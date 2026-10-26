'use strict';

const TOOL_NAMES = Object.freeze({
  Read: 'read_file',
  Write: 'write_file',
  Edit: 'edit_file',
  MultiEdit: 'edit_file',
  Bash: 'run_command',
  PowerShell: 'run_command',
  Grep: 'run_command',
  Glob: 'run_command',
  WebSearch: 'search_web',
  WebFetch: 'search_web',
  AskFollowupQuestion: 'ask_question',
  Subagent: 'invoke_subagent',
});

const MODEL_NAMES = Object.freeze({
  haiku: 'flash',
  sonnet: 'pro',
  opus: 'pro',
});

function tryLoadYaml() {
  try {
    return require('js-yaml');
  } catch (_) {
    return null;
  }
}

function parseSimpleFrontmatter(text) {
  const result = {};
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

function dumpSimpleFrontmatter(obj) {
  const lines = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map(v => JSON.stringify(v)).join(', ')}]`);
    } else if (typeof value === 'object') {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else if (typeof value === 'string' && (value.includes(':') || value.includes('#') || value.includes('\n'))) {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  return lines.join('\n');
}

function splitFrontmatter(source, label) {
  const match = String(source || '').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    throw new Error(`Cannot adapt Antigravity agent ${label}: missing YAML frontmatter`);
  }

  const yamlLib = tryLoadYaml();
  let frontmatter;
  if (yamlLib) {
    frontmatter = yamlLib.load(match[1]);
  } else {
    frontmatter = parseSimpleFrontmatter(match[1]);
  }

  if (!frontmatter || typeof frontmatter !== 'object' || Array.isArray(frontmatter)) {
    throw new Error(`Cannot adapt Antigravity agent ${label}: frontmatter must be an object`);
  }

  return {
    frontmatter,
    body: source.slice(match[0].length),
  };
}

function adaptToolName(name) {
  const trimmed = String(name || '').trim();
  if (!trimmed) return null;

  if (Object.hasOwn(TOOL_NAMES, trimmed)) {
    return TOOL_NAMES[trimmed];
  }

  if (trimmed.startsWith('mcp__')) {
    return trimmed
      .replace(/^mcp__/, 'mcp_')
      .replace(/__/g, '_')
      .replace(/[^A-Za-z0-9_]/g, '_')
      .toLowerCase();
  }

  // Preserve native Antigravity and standard snake_case tool names
  if (/^[a-z][a-z0-9_]*$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

function normalizeToolNames(value) {
  let names = [];
  if (Array.isArray(value)) {
    names = value;
  } else if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      names = trimmed
        .slice(1, -1)
        .split(',')
        .map(s => s.trim().replace(/^['"]|['"]$/g, ''));
    } else {
      names = trimmed.split(',');
    }
  }

  const adapted = names
    .map(name => adaptToolName(name))
    .filter(Boolean);
  return [...new Set(adapted)];
}

function adaptAntigravityAgent(source, label = '<unknown>') {
  const { frontmatter, body } = splitFrontmatter(source, label);
  const { color: _claudeColor, ...supportedFrontmatter } = frontmatter;
  const adapted = { ...supportedFrontmatter };
  if (Object.hasOwn(frontmatter, 'tools')) {
    adapted.tools = normalizeToolNames(frontmatter.tools);
  }
  if (Object.hasOwn(frontmatter, 'model')) {
    adapted.model = Object.hasOwn(MODEL_NAMES, frontmatter.model)
      ? MODEL_NAMES[frontmatter.model]
      : frontmatter.model;
  }

  const yamlLib = tryLoadYaml();
  const serialized = yamlLib
    ? yamlLib.dump(adapted, { lineWidth: -1, noRefs: true }).trimEnd()
    : dumpSimpleFrontmatter(adapted).trimEnd();

  return `---\n${serialized}\n---\n${body}`;
}

module.exports = {
  adaptAntigravityAgent,
  adaptToolName,
  normalizeToolNames,
  TOOL_NAMES,
  MODEL_NAMES,
};
