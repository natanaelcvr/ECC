---
description: Run Swift unit and integration test suites, supporting both Swift Testing (@Test) and XCTest, parse failure traces, and resolve test failures.
---

# Swift Test Runner

This command executes Swift test suites, parses test outputs, isolates failures, and applies fixes to achieve a green test suite.

## What This Command Does

1. **Discover Tests**: Finds test targets defined in `Package.swift` or Xcode test schemes.
2. **Execute Tests**: Runs `swift test` (supporting modern `#expect` Swift Testing and `XCTAssert`).
3. **Analyze Failures**: Extracts exact file paths, line numbers, and failure assertions.
4. **Fix Incrementally**: Updates implementation code or test doubles without touching unrelated code.
5. **Regression Verification**: Confirms all previously passing tests remain green.

## Diagnostic Commands Run

```bash
# Run all tests
swift test

# Run a specific test target
swift test --filter <TestTargetName>

# Run parallel tests with verbose failure output
swift test --parallel --enable-code-coverage
```

For Xcode projects on macOS:
```bash
xcodebuild test -scheme <SchemeName> -destination 'platform=iOS Simulator,name=iPhone 16'
```
