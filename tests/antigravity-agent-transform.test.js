'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {
  adaptAntigravityAgent,
  adaptToolName,
  normalizeToolNames,
} = require('../scripts/lib/install/antigravity-agent');

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

console.log('\n=== Testing Antigravity Agent Transform ===\n');

let passed = 0;
let failed = 0;

if (test('maps Claude native tools to Antigravity primitives', () => {
  assert.strictEqual(adaptToolName('Read'), 'read_file');
  assert.strictEqual(adaptToolName('Write'), 'write_file');
  assert.strictEqual(adaptToolName('Edit'), 'edit_file');
  assert.strictEqual(adaptToolName('MultiEdit'), 'edit_file');
  assert.strictEqual(adaptToolName('Bash'), 'run_command');
  assert.strictEqual(adaptToolName('PowerShell'), 'run_command');
  assert.strictEqual(adaptToolName('WebSearch'), 'search_web');
  assert.strictEqual(adaptToolName('AskFollowupQuestion'), 'ask_question');
  assert.strictEqual(adaptToolName('Subagent'), 'invoke_subagent');
})) passed++; else failed++;

if (test('adapts MCP tool names properly', () => {
  assert.strictEqual(
    adaptToolName('mcp__context7__resolve-library-id'),
    'mcp_context7_resolve_library_id'
  );
  assert.strictEqual(
    adaptToolName('mcp__playwright__browser_navigate'),
    'mcp_playwright_browser_navigate'
  );
})) passed++; else failed++;

if (test('preserves existing native snake_case Antigravity tools', () => {
  assert.strictEqual(adaptToolName('read_file'), 'read_file');
  assert.strictEqual(adaptToolName('write_file'), 'write_file');
  assert.strictEqual(adaptToolName('custom_mcp_tool'), 'custom_mcp_tool');
})) passed++; else failed++;

if (test('adapts complete agent frontmatter', () => {
  const source = `---
name: code-reviewer
description: Reviews code quality
model: sonnet
color: "#ff0000"
tools: Read, Write, Edit, Bash, Grep, mcp__playwright__browser_navigate
---
# Instructions
You are an expert code reviewer.`;

  const adapted = adaptAntigravityAgent(source, 'code-reviewer.md');
  const frontmatterMatch = adapted.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert.ok(frontmatterMatch, 'Adapted output must have YAML frontmatter');
  const frontmatterText = frontmatterMatch[1];

  assert.ok(!frontmatterText.includes('color:'), 'Should remove unsupported color metadata from frontmatter');
  assert.ok(frontmatterText.includes('model: pro'), 'Should adapt sonnet to pro');
  assert.ok(frontmatterText.includes('read_file'), 'Should include read_file');
  assert.ok(frontmatterText.includes('write_file'), 'Should include write_file');
  assert.ok(frontmatterText.includes('edit_file'), 'Should include edit_file');
  assert.ok(frontmatterText.includes('run_command'), 'Should include run_command');
  assert.ok(frontmatterText.includes('mcp_playwright_browser_navigate'), 'Should retain adapted MCP tool');
  assert.ok(adapted.includes('# Instructions\nYou are an expert code reviewer.'));
})) passed++; else failed++;

if (test('transforms all 71 canonical ECC agents without error', () => {
  const agentsDir = path.join(__dirname, '..', 'agents');
  const agentFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
  assert.ok(agentFiles.length >= 70, `Expected at least 70 agents, found ${agentFiles.length}`);

  for (const file of agentFiles) {
    const filePath = path.join(agentsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const adapted = adaptAntigravityAgent(content, file);

    const match = adapted.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    assert.ok(match, `${file} must produce valid frontmatter`);
    const frontmatterText = match[1];

    assert.ok(!frontmatterText.includes('color:'), `${file} frontmatter should not contain color`);
    assert.ok(!frontmatterText.includes('model: sonnet'), `${file} frontmatter should not contain sonnet`);
    assert.ok(!frontmatterText.includes('model: opus'), `${file} frontmatter should not contain opus`);
    assert.ok(!frontmatterText.includes('model: haiku'), `${file} frontmatter should not contain haiku`);
    assert.ok(!frontmatterText.includes('view_file'), `${file} frontmatter should not use legacy view_file`);
    assert.ok(!frontmatterText.includes('write_to_file'), `${file} frontmatter should not use legacy write_to_file`);
    assert.ok(!frontmatterText.includes('replace_file_content'), `${file} frontmatter should not use legacy replace_file_content`);
  }
})) passed++; else failed++;

console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
if (failed > 0) process.exit(1);
