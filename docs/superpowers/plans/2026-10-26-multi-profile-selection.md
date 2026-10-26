# Multi-Profile Selection and Module Scoping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable multi-profile selection (`--profiles java,data,frontend`) and introduce audience-focused profiles with granular modules in ECC to prevent Antigravity context exhaustion.

**Architecture:** Extend the installer request parser and manifest resolver to support multiple profile IDs via comma-separated values or repeated flags. Partition monolithic modules into focused domain modules. Add target audience profiles (`swift`, `java`, `frontend`, `python-ai`, `systems`, `dotnet`, `mobile`, `devops`, `security`, `data`, `agentic`, `product`) that combine these modules cleanly.

**Tech Stack:** Node.js (CommonJS), JSON Schemas, PowerShell (`install.ps1`), Bash (`install.sh`), ASD-STE100 compliant documentation.

**Spec:** Primary target audience profile classification with multi-profile CLI combination (`--profiles <id1>,<id2>,...`).

## Global Constraints

- Preserve backwards compatibility with single `--profile <name>`.
- Support `--profiles <name1>,<name2>` and `--profile <name1>,<name2>`.
- Allow repeated `--profile` arguments.
- Fail fast when any requested profile name is unknown.
- Deduplicate merged module lists across profiles.
- Write all new documentation and messages in ASD-STE100 plain English (sentences <=25 words, no semicolons, active voice).

## Review Focus

- Multi-profile comma splitting: `--profiles java,data,frontend` must resolve all three profiles and merge their module sets.
- Backward compatibility: `--profile java` must continue to work identically.
- Repeated flags: `--profile java --profile data` must merge both profiles.
- Unknown profile detection: Passing `--profiles java,unknown-stack` must throw an explicit error naming `unknown-stack`.
- Antigravity context budget safety: Combined profile module sets must stay lean.

---

## Tasks

### Task 1: Add Multi-Profile Parsing to `scripts/lib/install/request.js`

**Files:**
- Modify: `scripts/lib/install/request.js`
- Test: `tests/lib/install-request.test.js`

- [ ] Write failing unit tests in `tests/lib/install-request.test.js` for `--profiles java,data,frontend` and repeated `--profile` flags.
- [ ] Run `node tests/lib/install-request.test.js` to verify test failure.
- [ ] Update `parseInstallArgs` in `scripts/lib/install/request.js` to accept `--profiles` and `--profile` with comma-separated values.
- [ ] Update `normalizeInstallRequest` in `scripts/lib/install/request.js` to output `profileIds: string[]` while maintaining `profileId: string | null` for backwards compatibility.
- [ ] Run `node tests/lib/install-request.test.js` to confirm all tests pass.
- [ ] Commit changes: `git commit -m "feat(install): add multi-profile CLI parsing"`.

---

### Task 2: Multi-Profile Resolution in `scripts/lib/install-manifests.js`

**Files:**
- Modify: `scripts/lib/install-manifests.js`
- Test: `tests/lib/install-manifests.test.js`

- [ ] Write tests in `tests/lib/install-manifests.test.js` verifying module merging across multiple profiles.
- [ ] Update `resolveInstallPlan` in `scripts/lib/install-manifests.js` to accept `profileIds: string[]` or `profileId: string`.
- [ ] Validate each profile ID against `manifests.profiles`; throw when unknown.
- [ ] Aggregate and deduplicate `moduleIds` from all selected profiles.
- [ ] Fix legacy test assertions in `tests/lib/install-manifests.test.js` to account for native Antigravity hook support.
- [ ] Run `node tests/lib/install-manifests.test.js` to confirm all tests pass.
- [ ] Commit changes: `git commit -m "feat(manifests): resolve and merge multiple profiles"`.

---

### Task 3: Define Target Audience Profiles in `manifests/install-profiles.json`

**Files:**
- Modify: `manifests/install-profiles.json`
- Modify: `schemas/install-profiles.schema.json`
- Modify: `schemas/ecc-install-config.schema.json`

- [ ] Add the 12 target audience profiles:
  - `swift`: Apple platform development
  - `java`: Enterprise Java and JVM backend
  - `frontend`: Modern web frontend
  - `python-ai`: Python, machine learning, and AI pipelines
  - `systems`: Go, Rust, and C++ systems engineering
  - `dotnet`: .NET, C#, and F# development
  - `mobile`: Cross-platform mobile development
  - `devops`: Cloud infrastructure, containers, and networking
  - `security`: Application security and auditing
  - `data`: Database and persistence engineering
  - `agentic`: AI agent engineering and loops
  - `product`: Product documentation and operations
- [ ] Keep existing profiles (`minimal`, `core`, `developer`, `full`) for compatibility.
- [ ] Validate schema compliance with `node scripts/ci/validate-install-manifests.js`.
- [ ] Commit changes: `git commit -m "feat(profiles): add audience-focused profile definitions"`.

---

### Task 4: Granular Module Breakdown in `manifests/install-modules.json`

**Files:**
- Modify: `manifests/install-modules.json`
- Test: `tests/lib/install-targets.test.js`

- [ ] Split language-specific skills in `framework-language` into modular skill modules:
  - `skills-java`, `skills-frontend`, `skills-python`, `skills-systems`, `skills-dotnet`, `skills-mobile`.
- [ ] Add universal agent module `agents-universal` (~6 universal agents) and stack agent modules (`agents-swift`, `agents-java`, etc.).
- [ ] Map each target audience profile in `manifests/install-profiles.json` to its precise module set.
- [ ] Run `node tests/lib/install-targets.test.js` and `node scripts/ci/validate-install-manifests.js` to verify integrity.
- [ ] Commit changes: `git commit -m "feat(modules): partition framework skills into granular modules"`.

---

### Task 5: Documentation in Simplified Technical English (ASD-STE100)

**Files:**
- Modify: `docs/ANTIGRAVITY-PARITY-GUIDE.md`
- Modify: `README.md`
- Modify: `commands/configure-ecc.md`

- [ ] Update `docs/ANTIGRAVITY-PARITY-GUIDE.md` with multi-profile usage examples.
- [ ] Write instructions using ASD-STE100 rules:
  - Short sentences (<=20 words for instructions).
  - Active voice.
  - No semicolons.
  - Plain verbs (start, use, run, install).
- [ ] Provide table of all available profiles and combination examples.
- [ ] Commit changes: `git commit -m "docs: document multi-profile installation in ASD-STE100"`.

---

### Task 6: End-to-End Verification

**Files:**
- Create: `tests/lib/install-multi-profile.test.js`

- [ ] Create test verifying:
  - `parseInstallArgs` with `--profiles java,data,frontend`.
  - `resolveInstallPlan` produces expected merged module set.
  - Dry run of `install.ps1` or `install-apply.js` with `--profiles java,data,frontend`.
- [ ] Run full test suite across the repo.
- [ ] Commit changes: `git commit -m "test: add multi-profile end-to-end verification"`.
