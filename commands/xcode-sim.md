---
description: Manage and drive iOS Simulators via xcrun simctl, including booting, installing builds, launching apps, and inspecting simulator console logs.
---

# Xcode Simulator Manager

This command manages iOS Simulator lifecycle using `xcrun simctl` on macOS.

## What This Command Does

1. **List Devices**: Queries available runtimes and simulators (`xcrun simctl list devices`).
2. **Boot Simulator**: Powers on the requested simulator or finds the active booted device.
3. **Install & Launch**: Installs `.app` bundles and launches app targets.
4. **Log Inspection**: Streams real-time app logs via `xcrun simctl spawn booted log stream`.
5. **Capture State**: Captures screenshots or video recording for UI debugging.

## Common Operations

```bash
# List all available simulators
xcrun simctl list devices available

# Boot the preferred device (e.g. iPhone 16)
xcrun simctl boot "iPhone 16"

# Open Simulator GUI application
open -a Simulator

# Install app bundle into booted simulator
xcrun simctl install booted <path/to/App.app>

# Launch app with bundle identifier
xcrun simctl launch booted <bundle.identifier>

# Take screenshot
xcrun simctl io booted screenshot screenshot.png
```
