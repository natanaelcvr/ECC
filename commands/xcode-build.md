---
description: Build iOS, macOS, watchOS, or visionOS apps with xcodebuild, diagnose code-signing, dependency, or compilation issues, and parse clean error output.
---

# Xcode Build and Diagnose

This command orchestrates Xcode builds via `xcodebuild`, filters output for actionable diagnostics, and fixes project configuration and build errors.

## What This Command Does

1. **Auto-Detect Workspace/Project**: Locates `.xcworkspace` or `.xcodeproj` and lists schemes.
2. **Resolve Dependencies**: Fetches Swift package dependencies via `xcodebuild -resolvePackageDependencies`.
3. **Execute Build**: Invokes `xcodebuild` targeting the active simulator or device architecture.
4. **Parse Output**: Filters raw compiler logs down to file:line diagnostics.
5. **Verify Fix**: Re-executes the build to ensure a successful compilation.

## Commands Run

```bash
# List available schemes and configurations
xcodebuild -list

# Resolve Swift Package Manager dependencies
xcodebuild -resolvePackageDependencies

# Build for iOS Simulator (defaulting to iPhone 16 or first booted device)
xcodebuild -workspace <App>.xcworkspace -scheme <AppScheme> -destination 'platform=iOS Simulator,name=iPhone 16' build
```
