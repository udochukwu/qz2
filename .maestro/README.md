# Maestro Tests for Quizard Mobile App

This directory contains Maestro e2e tests for the Quizard mobile application.

## Test Files

- `config.yaml` - Global Maestro configuration settings
- `basic-app-launch.yaml` - Basic app launch validation test
- `intro-flow.yaml` - Intro screen navigation test

## Running Tests

### Prerequisites
- Maestro CLI installed (`curl -fsSL "https://get.maestro.mobile.dev" | bash`)
- iOS Simulator or Android Emulator running
- Development build of the app installed

### Commands
```bash
# Run all tests
maestro test .maestro/

# Run specific test
maestro test .maestro/basic-app-launch.yaml

# Run with continuous mode (watch for changes)
maestro test --watch .maestro/
```

## Test Structure

Each test file follows this structure:
```yaml
appId: id1667996582
---
- launchApp
- assertVisible: "Expected Text"
- tapOn:
    testId: "element-test-id"
```

## Adding New Tests

1. Create a new `.yaml` file in this directory
2. Follow the naming convention: `feature-name.yaml`
3. Include the app identifier at the top
4. Use testId selectors for reliable element targeting
5. Add descriptive comments explaining the test purpose