# Xcode & Antigravity Setup and Integration Guide

This guide describes how to use ECC (Everything Claude Code & Antigravity) with Xcode and the Google Antigravity extension on macOS.

---

## 1. Overview

Xcode with the Antigravity extension connects to the local Antigravity agent engine running on macOS.
By installing ECC globally to `~/.gemini/config/plugins/ecc`, all ECC skills, workflows, rules, and agents are automatically discovered by Antigravity inside Xcode.

---

## 2. Quick Installation (Global Scope)

Run from any terminal on macOS:

```bash
# Clone your fork of ECC:
git clone https://github.com/<your-username>/ECC.git ~/ECC
cd ~/ECC

# Install globally for Antigravity & Xcode:
./install.sh --target antigravity-home --profile minimal
```

This installs ECC as a native Antigravity plugin into:
`~/.gemini/config/plugins/ecc/`

---

## 3. Verifying Installation in Xcode

1. Open your Swift or iOS project in **Xcode**.
2. Open the **Antigravity** extension panel in Xcode.
3. In the chat, type `/` to see available slash workflows:
   - `/swift-build`: Diagnoses Swift 6 concurrency and compilation errors.
   - `/swift-test`: Runs unit/integration test suites and isolates failures.
   - `/xcode-build`: Builds schemes via `xcodebuild`.
   - `/xcode-sim`: Boots simulators, installs `.app` builds, and streams logs.
4. All 311 ECC skills are discoverable on demand.

---

## 4. Coexistence with Installed Swift Skills

If you have installed standalone Swift skills (such as `swift-concurrency`, `swiftui-pro`, `swiftdata-expert`, `swift-testing-patterns`) in `~/.gemini/config/skills/`:
- **Rules & Skills Precedence**: Antigravity loads workspace customizations hierarchically.
- ECC's generalized engineering rules (`common-coding-style`, `common-testing`) complement Apple-platform specific skills.
- The lifecycle hook engine (`hooks.json`) runs GateGuard fact-forcing and safety checks before destructive commands, preventing accidental deletion of project files.
