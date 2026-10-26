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

You can select a single profile or combine multiple profiles with `--profiles`.

| Profile | Target Audience | Included Capabilities |
|---|---|---|
| **`swift`** | Apple iOS and macOS developers | Swift, SwiftUI, SwiftData, App Store tools, and Xcode commands |
| **`java`** | Enterprise Java developers | Spring Boot, Quarkus, Kotlin, and JVM testing patterns |
| **`frontend`** | Web frontend developers | React, Vue, Next.js, Vite, design systems, and accessibility |
| **`python-ai`** | Python and AI engineers | FastAPI, Django, machine learning pipelines, and research tools |
| **`systems`** | Low-level systems engineers | Go, Rust, C++, C#, and concurrency patterns |
| **`dotnet`** | .NET application developers | C#, F#, modern backend patterns, and xUnit testing |
| **`mobile`** | Cross-platform mobile developers | Flutter, Dart, React Native, and Compose Multiplatform |
| **`data`** | Database and data engineers | PostgreSQL, MySQL, Redis, ClickHouse, and migrations |
| **`devops`** | Cloud and infrastructure engineers | Docker, Kubernetes, Terraform, networking, and CI/CD |
| **`security`** | Application security engineers | Code auditing, vulnerability detection, and secret sanitization |
| **`agentic`** | Autonomous agent engineers | Loop orchestration, eval harnesses, and memory systems |
| **`product`** | Product teams and technical writers | Documentation governance, technical writing, and media tools |
| **`minimal`** | Low-context baseline | Core rules, commands, and quality workflows without hooks |
| **`core`** | Standard baseline | Core rules, commands, hook runtime, and quality workflows |
| **`developer`** | Multi-stack engineers | General engineering skills across common languages |
| **`full`** | Complete ECC library | All classified modules (recommended only for high-context models) |

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
