# Google Antigravity & Claude Code Parity Guide

This document explains how ECC achieves complete parity between Claude Code and Google Antigravity.
The guide supports three environments:
1. Windows Native Antigravity IDE
2. macOS Antigravity IDE
3. Xcode with the Antigravity Extension on macOS

---

## 1. Feature Parity

| Feature | Claude Code | ECC Antigravity Plugin |
|---|---|---|
| **Discovery** | `.claude-plugin/plugin.json` | `~/.gemini/config/plugins/ecc/` |
| **File Reading** | `Read` | `read_file` |
| **File Writing** | `Write` | `write_file` |
| **File Editing** | `Edit` | `edit_file` |
| **Command Execution** | `Bash` | `run_command` |
| **Model Tiers** | `haiku`, `sonnet`, `opus` | `flash`, `pro` |
| **Lifecycle Hooks** | Node.js hooks | `scripts/hooks/antigravity-hook-dispatcher.js` |
| **GateGuard Safety** | Fact-forcing checks | Supported on Windows and macOS |
| **Custom Commands** | Slash commands | Workflows in `workflows/` |
| **Swift & Xcode Tooling** | None | `/swift-build`, `/swift-test`, `/xcode-build`, `/xcode-sim` |

---

## 2. Context Budget Protection

Google Antigravity enforces a strict context limit on skills and agents.
Installing all 311 skills and 71 agents causes context exclusions.
When context budget overflows, Antigravity drops skills silently.
ECC solves this issue with modular profiles.
Each profile loads only the skills and agents for your technology stack.

---

## 3. Available Profiles

You can select a single profile with `--profile` or combine multiple profiles with `--profiles`.
Every skill listed in this catalog exists physically in the `skills/` directory of the ECC repository.

### Detailed Profile Catalog

| Profile | Target Audience | Specific Domain Skills (ECC Verified) | Quality & Workflow Baseline | Total Skills |
|---|---|---|---|:---:|
| **`swift`** | Apple platform engineering: Swift, SwiftUI, App Store, and Xcode workflows. | `foundation-models-on-device`, `ios-icon-gen`, `liquid-glass-design`, `swift-actor-persistence`, `swift-concurrency-6-2`, `swift-protocol-di-testing`, `swiftui-patterns` | Included (52 quality & verification skills) | 59 |
| **`java`** | Enterprise Java and JVM engineering: Spring Boot, Quarkus, JPA, and JVM build tools. | `api-design`, `backend-patterns`, `clickhouse-io`, `coding-standards`, `contract-first`, `database-migrations`, `hexagonal-architecture`, `i18n-sync`, `java-coding-standards`, `jpa-patterns`, `kotlin-coroutines-flows`, `kotlin-exposed-patterns`, `kotlin-ktor-patterns`, `kotlin-patterns`, `kotlin-testing`, `mcp-server-patterns`, `mybatis-patterns`, `mysql-patterns`, `postgres-patterns`, `prisma-patterns`, `quarkus-patterns`, `quarkus-tdd`, `quarkus-verification`, `redis-patterns`, `springboot-patterns`, `springboot-tdd`, `springboot-verification` | Included (52 quality & verification skills) | 79 |
| **`frontend`** | Modern web frontend: React, Vue, Next.js, Nuxt, Vite, UI design, and accessibility. | `accessibility`, `angular-developer`, `api-design`, `backend-patterns`, `bun-runtime`, `coding-standards`, `contract-first`, `design-system`, `frontend-a11y`, `frontend-design-direction`, `frontend-patterns`, `frontend-slides`, `hexagonal-architecture`, `i18n-sync`, `make-interfaces-feel-better`, `mcp-server-patterns`, `motion-advanced`, `motion-foundations`, `motion-patterns`, `nestjs-patterns`, `nextjs-turbopack`, `nuxt4-patterns`, `react-patterns`, `react-performance`, `react-testing`, `ui-to-vue`, `vite-patterns`, `vue-patterns` | Included (52 quality & verification skills) | 80 |
| **`python-ai`** | Python backend and AI pipelines: FastAPI, Django, machine learning, and research APIs. | `api-design`, `backend-patterns`, `coding-standards`, `contract-first`, `deep-research`, `django-celery`, `django-patterns`, `django-tdd`, `django-verification`, `documentation-lookup`, `exa-search`, `fastapi-patterns`, `generating-python-installer`, `hexagonal-architecture`, `i18n-sync`, `mcp-server-patterns`, `ml-adoption-playbook`, `mle-workflow`, `osint-investigation`, `python-patterns`, `python-testing`, `pytorch-patterns`, `recsys-pipeline-architect`, `research-ops`, `scientific-db-pubmed-database`, `scientific-db-uspto-database`, `scientific-pkg-gget`, `scientific-thinking-literature-review`, `scientific-thinking-scholar-evaluation` | Included (52 quality & verification skills) | 81 |
| **`systems`** | Systems programming: Go, Rust, C++, concurrency, and performance optimization. | `api-design`, `backend-patterns`, `coding-standards`, `contract-first`, `cpp-coding-standards`, `cpp-testing`, `csharp-testing`, `dotnet-patterns`, `fsharp-testing`, `golang-patterns`, `golang-testing`, `hexagonal-architecture`, `i18n-sync`, `mcp-server-patterns`, `rust-patterns`, `rust-testing` | Included (52 quality & verification skills) | 68 |
| **`dotnet`** | Enterprise .NET engineering: C#, F#, modern backend patterns, and xUnit testing. | `api-design`, `backend-patterns`, `clickhouse-io`, `coding-standards`, `contract-first`, `cpp-coding-standards`, `cpp-testing`, `csharp-testing`, `database-migrations`, `dotnet-patterns`, `fsharp-testing`, `golang-patterns`, `golang-testing`, `hexagonal-architecture`, `i18n-sync`, `jpa-patterns`, `mcp-server-patterns`, `mybatis-patterns`, `mysql-patterns`, `postgres-patterns`, `prisma-patterns`, `redis-patterns`, `rust-patterns`, `rust-testing` | Included (52 quality & verification skills) | 76 |
| **`mobile`** | Cross-platform mobile engineering: Flutter, Dart, Android clean architecture, and Compose Multiplatform. | `android-clean-architecture`, `api-design`, `backend-patterns`, `coding-standards`, `compose-multiplatform-patterns`, `contract-first`, `dart-flutter-patterns`, `flutter-dart-code-review`, `hexagonal-architecture`, `i18n-sync`, `mcp-server-patterns`, `react-native-patterns` | Included (52 quality & verification skills) | 64 |
| **`data`** | Database and persistence engineering: PostgreSQL, MySQL, Redis, ClickHouse, and migrations. | `clickhouse-io`, `database-migrations`, `jpa-patterns`, `mybatis-patterns`, `mysql-patterns`, `postgres-patterns`, `prisma-patterns`, `redis-patterns` | Included (52 quality & verification skills) | 60 |
| **`devops`** | Cloud infrastructure, containers, networking, SRE, and deployment workflows. | `canary-watch`, `cisco-ios-patterns`, `deployment-patterns`, `docker-patterns`, `flox-environments`, `homelab-network-readiness`, `homelab-network-setup`, `homelab-pihole-dns`, `homelab-vlan-segmentation`, `homelab-wireguard-vpn`, `kubernetes-patterns`, `netmiko-ssh-automation`, `network-bgp-diagnostics`, `network-config-validation`, `network-interface-health`, `terminal-opener`, `uncloud` | None | 17 |
| **`security`** | Application security engineering: code auditing, vulnerability detection, and secret sanitization. | `agent-security-hardening`, `defi-amm-security`, `django-security`, `evm-token-decimals`, `gateguard`, `healthcare-cdss-patterns`, `healthcare-emr-patterns`, `healthcare-eval-harness`, `healthcare-phi-compliance`, `hipaa-compliance`, `laravel-security`, `llm-trading-agent-security`, `mcp-dependency-review`, `nodejs-keccak256`, `perl-security`, `quarkus-security`, `safety-guard`, `security-bounty-hunter`, `security-review`, `security-scan`, `springboot-security` | Included (52 quality & verification skills) | 73 |
| **`agentic`** | Autonomous AI agent engineering: loop orchestration, eval harnesses, and harness optimization. | `agent-architecture-audit`, `agent-harness-construction`, `agent-payment-x402`, `agent-runtime-gateway-smoke-test`, `agentic-engineering`, `agentic-os`, `ai-first-engineering`, `autonomous-agent-harness`, `autonomous-loops`, `blueprint`, `claude-devfleet`, `content-hash-cache-pattern`, `continuous-agent-loop`, `cost-aware-llm-pipeline`, `data-scraper-agent`, `dynamic-workflow-mode`, `enterprise-agent-ops`, `gan-style-harness`, `hermes-imports`, `nanoclaw-repl`, `openclaw-persona-forge`, `opensource-pipeline`, `orch-add-feature`, `orch-build-mvp`, `orch-change-feature`, `orch-fix-defect`, `orch-pipeline`, `orch-refine-code`, `plan-orchestrate`, `prompt-caching-strategy`, `prompt-optimizer`, `ralphinho-rfc-pipeline`, `regex-vs-llm-structured-text`, `search-first`, `team-agent-orchestration`, `team-builder`, `token-budget-advisor`, `unified-memory` | Included (52 quality & verification skills) | 90 |
| **`product`** | Product operations, technical writing, media generation, and documentation governance. | `article-writing`, `blender-motion-state-inspection`, `brand-discovery`, `brand-voice`, `competitive-platform-analysis`, `competitive-report-structure`, `content-engine`, `crosspost`, `fal-ai-media`, `investor-materials`, `investor-outreach`, `lead-intelligence`, `manim-video`, `market-research`, `marketing-campaign`, `nutrient-document-processing`, `product-capability`, `remotion-video-creation`, `seo`, `social-graph-ranker`, `social-publisher`, `taste`, `taste-application`, `taste-distillation`, `tasteforge-video`, `ui-demo`, `video-editing`, `videodb`, `visa-doc-translate`, `x-api` | None | 30 |
| **`minimal`** | Low-context Claude Code setup with rules, agents, commands, platform configs, and quality workflow support, but no hook runtime. | *(Baseline only)* | Included (52 quality & verification skills) | 52 |
| **`core`** | Minimal harness baseline with commands, hooks, platform configs, and quality workflow support. | *(Baseline only)* | Included (52 quality & verification skills) | 52 |
| **`developer`** | Default engineering profile for most ECC users working across app codebases. | All 80 multi-language framework, database, and orchestration skills | Included (52 quality & verification skills) | 132 |
| **`full`** | Complete ECC install with all currently classified modules. | All 259 domain skills across all classified modules | Included (52 quality & verification skills) | 311 |

---

### Baseline Quality and Workflow Skills (52 Skills)
The baseline profiles include these 52 universal quality, testing, learning, and git workflow skills:
`agent-introspection-debugging`, `agent-self-evaluation`, `agent-sort`, `ai-regression-testing`, `architecture-decision-records`, `brownfield-retrospective`, `browser-qa`, `ck`, `click-path-audit`, `code-tour`, `codebase-onboarding`, `codehealth-mcp`, `config-gc`, `configure-ecc`, `context-budget`, `continuous-learning`, `continuous-learning-v2`, `conventional-commit-review`, `council`, `council-multi-model`, `deepseek-harness-setup`, `delivery-gate`, `dev-team`, `e2e-testing`, `ecc-guide`, `ecc-recipes`, `error-handling`, `eval-harness`, `git-workflow`, `growth-log`, `hookify-rules`, `inherit-legacy-style`, `intent-driven-development`, `iterative-retrieval`, `living-docs-governance`, `loop-design-check`, `plan-canvas`, `plankton-code-quality`, `product-lens`, `production-audit`, `repo-scan`, `rules-distill`, `santa-method`, `skill-comply`, `skill-host-compat`, `skill-scout`, `skill-stocktake`, `story-lifecycle`, `strategic-compact`, `tdd-workflow`, `verification-loop`, `windows-desktop-e2e`.

---

### Repository Boundary and Skill Verification

Every skill listed in this catalog exists physically in the ECC repository.
External skills in your user environment (`~/.gemini/config/skills/`) do not belong to ECC.
For example, `reverse-engineer-anything` (REA) and third-party Swift skills are separate tools.
ECC never installs, modifies, or manages external tools.
The installer copies only repository files located in `skills/`, `rules/`, `agents/`, `commands/`, and `hooks/`.

---

## 4. Installation Procedures

### Procedure A: Global User Installation (Recommended)
This procedure installs ECC to `~/.gemini/config/plugins/ecc/`.
The installation applies to all workspaces in Antigravity IDE and Xcode.

#### On Windows (PowerShell):

Install a single profile:
```powershell
.\install.ps1 --target antigravity-home --profile swift
```

Install multiple profiles together:
```powershell
.\install.ps1 --target antigravity-home --profiles java,data,frontend
```

#### On macOS and Linux:

Install a single profile:
```bash
./install.sh --target antigravity-home --profile swift
```

Install multiple profiles together:
```bash
./install.sh --target antigravity-home --profiles java,data,frontend
```

---

### Procedure B: Project-Local Installation
This procedure installs ECC into `./.agents/` in your project repository.

#### On Windows (PowerShell):
```powershell
& "C:\path\to\ECC\install.ps1" --target antigravity --profiles java,data
```

#### On macOS and Linux:
```bash
/path/to/ECC/install.sh --target antigravity --profiles java,data
```

---

## 5. Verification

Run the verification test suite:

```bash
node tests/lib/install-multi-profile.test.js
node tests/antigravity-hook-dispatcher.test.js
node tests/antigravity-agent-transform.test.js
node tests/lib/install-targets.test.js
```

All test cases must report PASS.

---

## 6. Uninstallation

To remove ECC from your Antigravity environment, run:

```bash
# Remove global user plugin:
node scripts/uninstall.js --target antigravity-home

# Remove project-local installation:
node scripts/uninstall.js --target antigravity
```
