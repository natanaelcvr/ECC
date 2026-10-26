/**
 * Tests for multi-profile installation and module resolution.
 */

const assert = require('assert');
const { parseInstallArgs, normalizeInstallRequest } = require('../../scripts/lib/install/request');
const { resolveInstallPlan } = require('../../scripts/lib/install-manifests');

function test(name, fn) {
  try {
    fn();
    console.log(`  \u2713 ${name}`);
    return true;
  } catch (error) {
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${error.message}`);
    return false;
  }
}

function runTests() {
  console.log('\n=== Testing Multi-Profile Installation ===\n');

  let passed = 0;
  let failed = 0;

  if (test('parses --profiles with comma-separated list', () => {
    const parsed = parseInstallArgs([
      'node',
      'scripts/install-apply.js',
      '--profiles', 'java,data,frontend',
    ]);
    assert.deepStrictEqual(parsed.profileIds, ['java', 'data', 'frontend']);
    assert.strictEqual(parsed.profileId, 'java');
  })) passed++; else failed++;

  if (test('parses repeated --profile flags into unique list', () => {
    const parsed = parseInstallArgs([
      'node',
      'scripts/install-apply.js',
      '--profile', 'java',
      '--profile', 'data',
      '--profile', 'frontend',
    ]);
    assert.deepStrictEqual(parsed.profileIds, ['java', 'data', 'frontend']);
  })) passed++; else failed++;

  if (test('normalizes multi-profile request cleanly', () => {
    const normalized = normalizeInstallRequest({
      target: 'antigravity-home',
      profileIds: ['java', 'data', 'frontend'],
      moduleIds: [],
    });
    assert.deepStrictEqual(normalized.profileIds, ['java', 'data', 'frontend']);
    assert.strictEqual(normalized.profileId, 'java');
    assert.strictEqual(normalized.target, 'antigravity-home');
  })) passed++; else failed++;

  if (test('resolves multi-profile plan and merges modules for java,data,frontend', () => {
    const plan = resolveInstallPlan({
      profileIds: ['java', 'data', 'frontend'],
      target: 'antigravity-home',
      homeDir: '/Users/test',
    });

    assert.deepStrictEqual(plan.profileIds, ['java', 'data', 'frontend']);
    assert.strictEqual(plan.profileId, 'java');

    // Modules from java profile
    assert.ok(plan.selectedModuleIds.includes('framework-java'), 'Must include framework-java');
    assert.ok(plan.selectedModuleIds.includes('database'), 'Must include database');

    // Modules from frontend profile
    assert.ok(plan.selectedModuleIds.includes('framework-frontend'), 'Must include framework-frontend');

    // Baseline modules
    assert.ok(plan.selectedModuleIds.includes('rules-core'), 'Must include rules-core');
    assert.ok(plan.selectedModuleIds.includes('commands-core'), 'Must include commands-core');
    assert.ok(plan.selectedModuleIds.includes('hooks-runtime'), 'Must include hooks-runtime');

    // Excluded modules that were NOT requested
    assert.ok(!plan.selectedModuleIds.includes('swift-apple'), 'Must NOT include swift-apple');
    assert.ok(!plan.selectedModuleIds.includes('framework-python'), 'Must NOT include framework-python');
    assert.ok(!plan.selectedModuleIds.includes('devops-infra'), 'Must NOT include devops-infra');
  })) passed++; else failed++;

  if (test('resolves single swift profile with tight footprint', () => {
    const plan = resolveInstallPlan({
      profileId: 'swift',
      target: 'antigravity-home',
      homeDir: '/Users/test',
    });

    assert.ok(plan.selectedModuleIds.includes('swift-apple'), 'Must include swift-apple');
    assert.ok(!plan.selectedModuleIds.includes('framework-java'), 'Must not include framework-java');
    assert.ok(!plan.selectedModuleIds.includes('framework-frontend'), 'Must not include framework-frontend');
    assert.ok(!plan.selectedModuleIds.includes('database'), 'Must not include database');
  })) passed++; else failed++;

  if (test('rejects unknown profile in multi-profile list', () => {
    assert.throws(
      () => resolveInstallPlan({
        profileIds: ['java', 'invalid-profile-xyz'],
        target: 'antigravity-home',
      }),
      /Unknown install profile: invalid-profile-xyz/
    );
  })) passed++; else failed++;

  console.log(`\nResults: Passed: ${passed}, Failed: ${failed}\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
