---
description: Build Swift packages or projects, diagnose Swift 6 concurrency warnings and compilation errors, and apply surgical fixes.
---

# Swift Build and Fix

This command runs Swift build diagnostics, parses compiler and concurrency errors, and applies minimal, surgical fixes.

## What This Command Does

1. **Detect Project Layout**: Detects `Package.swift` or `.xcodeproj`/`.xcworkspace`.
2. **Execute Build**: Runs `swift build` (or `xcodebuild` if inside an Xcode project).
3. **Analyze Diagnostics**: Groups errors by file, separating Swift Concurrency (`Sendable`, data races, `@MainActor`) from syntax/type errors.
4. **Fix Incrementally**: Applies minimal changes preserving documentation integrity.
5. **Verify Fixes**: Re-runs build until green.

## Diagnostic Commands Run

```bash
# Swift Package Manager build
swift build

# Swift 6 concurrency check (strict concurrency diagnostics)
swift build -Xswiftc -strict-concurrency=complete

# Clean build if state is corrupt
swift package clean
```

For Xcode projects:
```bash
# Resolve package dependencies
xcodebuild -resolvePackageDependencies

# Build project scheme
xcodebuild -scheme <SchemeName> -destination 'generic/platform=iOS Simulator' build
```

## Workflow Execution

1. Run the primary build command.
2. If `swift build` fails:
   - Identify whether the error is a missing import, type mismatch, or concurrency violation.
   - For concurrency violations: apply `@MainActor`, `Sendable` conformance, or nonisolated helpers according to modern Swift Concurrency guidelines.
3. Re-run `swift build` to confirm resolution.
