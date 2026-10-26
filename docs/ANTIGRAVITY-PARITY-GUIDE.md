# Google Antigravity & Claude Code Full Parity Guide

This document details how ECC achieves complete parity between Claude Code and Google Antigravity across:
1. **Windows Native Antigravity IDE**
2. **macOS Antigravity IDE**
3. **Xcode with Antigravity Extension (macOS)**

---

## 1. Architecture & Feature Comparison

| Feature | Claude Code | ECC Native Antigravity Plugin |
|---|:---:|:---:|
| **Discovery Mechanism** | `.claude-plugin/plugin.json` | `.antigravity-plugin/plugin.json` or `~/.gemini/config/plugins/ecc/` |
| **Agent Tool Primitive** | `Read`, `Write`, `Edit`, `Bash` | `read_file`, `write_file`, `edit_file`, `run_command` |
| **Model Tiers** | `haiku`, `sonnet`, `opus` | `flash`, `pro` |
| **Lifecycle Hooks** | Node.js hook scripts | `hooks.json` via `scripts/hooks/antigravity-hook-dispatcher.js` |
| **GateGuard Enforcement** | PreToolUse fact-forcing | Active in Windows (cmd/pwsh) & macOS (bash/zsh) |
| **Workflows** | Custom slash commands | `.agents/workflows/` and plugin `workflows/` |
| **Swift & Xcode Tooling** | None | `/swift-build`, `/swift-test`, `/xcode-build`, `/xcode-sim` |

---

## 2. Installation Instructions

### Option A: Global Installation (Recommended)
Installs ECC into `~/.gemini/config/plugins/ecc/`. Available in every workspace and in Xcode.

#### On macOS & Linux:
```bash
git clone https://github.com/<your-username>/ECC.git ~/ECC
cd ~/ECC
./install.sh --target antigravity-home --profile minimal
```

#### On Windows Native (PowerShell):
```powershell
git clone https://github.com/<your-username>/ECC.git $HOME\ECC
cd $HOME\ECC
.\install.ps1 --target antigravity-home --profile minimal
```

---

### Option B: Project-Local Installation
Installs ECC into `./.agents/` of your current project repository.

#### On macOS & Linux:
```bash
cd /path/to/my-project
/path/to/ECC/install.sh --target antigravity --profile minimal
```

#### On Windows Native:
```powershell
cd C:\path\to\my-project
& "C:\path\to\ECC\install.ps1" --target antigravity --profile minimal
```

---

## 3. Hook Engine Verification

To verify that the Antigravity hook bridge is operational:

```bash
# Run unit tests
node tests/antigravity-hook-dispatcher.test.js
node tests/antigravity-agent-transform.test.js
node tests/lib/install-targets.test.js
```

All tests must report **PASS**.
