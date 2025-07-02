# E2E Testing Setup for Quizard Mobile App

This document provides comprehensive instructions for setting up and using end-to-end (e2e) testing for the Quizard mobile application using Maestro as the primary framework and Detox as a backup option.

## Overview

The Quizard mobile app uses a dual-framework approach for e2e testing:
- **Maestro** (Primary): Simple YAML-based tests with excellent React Native support
- **Detox** (Backup): JavaScript-based tests with deep React Native integration

## Prerequisites

### System Requirements
- **macOS, Linux, or Windows with WSL**
- **Node.js** >= 18 (already configured in package.json)
- **Yarn** 1.22.22 (current package manager)
- **React Native CLI** (for building development builds)

### Mobile Development Environment
- **iOS**: Xcode with iOS Simulator (iOS 12+)
- **Android**: Android Studio with SDK and emulator (API 21+)

## Maestro Setup (Primary Framework)

### 1. Install Maestro CLI

```bash
# macOS, Linux, or Windows (WSL)
curl -fsSL "https://get.maestro.mobile.dev" | bash

# macOS with Homebrew (alternative)
brew tap mobile-dev-inc/tap
brew install maestro

# Verify installation
maestro --version
```

### 2. Project Structure

The Maestro configuration is located in the `.maestro/` directory:

```
.maestro/
├── config.yaml              # Global Maestro configuration
├── basic-app-launch.yaml    # Basic app launch test
├── intro-flow.yaml          # Intro screen navigation test
└── README.md                # Maestro-specific documentation
```

### 3. Running Maestro Tests

```bash
# Run all Maestro tests
yarn test:e2e:maestro

# Run specific test file
maestro test .maestro/basic-app-launch.yaml

# Run with continuous mode (watches for changes)
yarn test:e2e:maestro:watch

# Run on specific device
maestro test --device-id <device-id> .maestro/
```

### 4. Device Setup for Maestro

#### iOS Simulator
```bash
# List available simulators
xcrun simctl list devices

# Boot a simulator
xcrun simctl boot "iPhone 15 Pro"

# Install development build
# Build first: npx react-native run-ios --configuration Debug
# The app will be automatically installed
```

#### Android Emulator
```bash
# List available emulators
emulator -list-avds

# Start emulator
emulator -avd Pixel_3a_API_30_x86

# Install development build
# Build first: npx react-native run-android --variant=googlePlayDebug
# The APK will be automatically installed
```

## Detox Setup (Backup Framework)

### 1. Install Detox CLI

```bash
# Install globally
npm install -g detox-cli

# Verify installation
detox --version
```

### 2. Project Structure

Detox configuration files:

```
.detoxrc.js                   # Detox configuration
e2e/
├── jest.config.js           # Jest configuration for Detox
└── init.js                  # Basic Detox tests
android/app/src/androidTest/java/com/aihomework/
└── DetoxTest.java           # Android native test class
```

### 3. Running Detox Tests

```bash
# Build the app for testing
yarn test:e2e:detox:build

# Run tests
yarn test:e2e:detox:test

# Run on specific platform
yarn test:e2e:detox:ios      # iOS Simulator
yarn test:e2e:detox:android  # Android Emulator
```

### 4. Device Setup for Detox

#### iOS Simulator
```bash
# Build iOS app for testing
detox build -c ios.sim.debug

# Run tests
detox test -c ios.sim.debug
```

#### Android Emulator
```bash
# Build Android app for testing
detox build -c android.emu.debug

# Run tests
detox test -c android.emu.debug
```

## Development Build Requirements

**Important**: Both Maestro and Detox require development builds rather than Expo Go for reliable testing of native features.

### Building Development Builds

#### iOS Development Build
```bash
# Clean build
cd ios && xcodebuild clean && cd ..

# Build for simulator
npx react-native run-ios --configuration Debug

# The app will be installed automatically on the simulator
```

#### Android Development Build
```bash
# Clean build
cd android && ./gradlew clean && cd ..

# Build debug APK
npx react-native run-android --variant=googlePlayDebug

# The APK will be installed automatically on the emulator
```

## Writing Tests

### Maestro Test Structure

Maestro tests use declarative YAML syntax:

```yaml
# Example test file: .maestro/example-test.yaml
appId: com.aihomework
---
- launchApp
- assertVisible: "Expected Text"
- tapOn:
    testId: "element-test-id"
- assertVisible: "Next Screen Text"
```

### Detox Test Structure

Detox tests use JavaScript/Jest syntax:

```javascript
// Example test file: e2e/example.test.js
describe('Example Test', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate through app', async () => {
    await expect(element(by.text('Meet Quizard'))).toBeVisible();
    await element(by.id('intro-get-started-button')).tap();
    await expect(element(by.text('Loading'))).toBeVisible();
  });
});
```

## TestID Implementation

### Naming Convention

Use hierarchical naming for testID props:
- `screen-element-action` (e.g., `intro-get-started-button`)
- `component-type-identifier` (e.g., `tab-home`, `modal-close`)

### Adding TestIDs to Components

```typescript
// Component with testID support
interface ButtonProps {
  testID?: string;
  // other props...
}

const Button = ({ testID, ...props }: ButtonProps) => (
  <TouchableOpacity testID={testID} {...props}>
    {/* button content */}
  </TouchableOpacity>
);
```

### Current TestID Implementation

The following components already have testID support:
- `PrimaryButton` - Main action buttons
- `TextButton` - Secondary text buttons
- Tab navigation buttons (`tab-home`, `tab-calculator`, `tab-profile`)
- Intro screen Get Started button (`intro-get-started-button`)

## Troubleshooting

### Common Issues

#### Maestro Issues
1. **App not found**: Ensure the correct `appId` in test files matches your app's package name
2. **Element not found**: Verify testID props are correctly implemented in components
3. **Timeout errors**: Increase timeout values in `.maestro/config.yaml`

#### Detox Issues
1. **Build failures**: Clean and rebuild both the app and test builds
2. **Simulator/Emulator issues**: Restart the device and ensure it's properly booted
3. **Test synchronization**: Detox automatically waits for React Native, but manual waits may be needed for animations

### Debug Commands

```bash
# Maestro debugging
maestro test --debug .maestro/test-file.yaml

# Detox debugging
detox test --loglevel verbose

# Check device connectivity
# iOS: xcrun simctl list devices
# Android: adb devices
```

## CI/CD Integration (Future)

This setup prepares for future CI/CD integration:

### GitHub Actions (Maestro)
```yaml
- uses: mobile-dev-inc/action-maestro-cloud@v1
  with:
    api-key: ${{ secrets.MAESTRO_API_KEY }}
    app-file: android/app/build/outputs/apk/debug/app-debug.apk
    workspace: .maestro/
```

### GitHub Actions (Detox)
```yaml
- name: Run Detox tests
  run: |
    detox build -c android.emu.debug
    detox test -c android.emu.debug
```

## Best Practices

### Test Organization
1. **Separate test files** by feature or user journey
2. **Use descriptive names** for test files and test cases
3. **Keep tests focused** on specific functionality
4. **Avoid test interdependencies** - each test should be independent

### Element Selection
1. **Prefer testID** over text-based selectors for reliability
2. **Use hierarchical naming** for testID props
3. **Avoid brittle selectors** like absolute coordinates or complex XPath

### Test Maintenance
1. **Update tests** when UI changes occur
2. **Review test failures** promptly to maintain test suite health
3. **Document test purposes** with clear comments
4. **Regular test execution** to catch regressions early

## Team Workflow

### For Developers
1. **Add testID props** when creating new interactive components
2. **Follow naming conventions** for consistent testID implementation
3. **Test locally** before pushing changes that affect UI
4. **Update tests** when modifying existing functionality

### For QA Engineers
1. **Write new tests** for new features and user journeys
2. **Maintain existing tests** when requirements change
3. **Report test issues** with detailed reproduction steps
4. **Validate test coverage** for critical user paths

## Next Steps

This foundation enables future test development for:
- User onboarding flow testing
- Paywall and subscription testing
- Quiz creation and taking workflows
- Flashcard creation and study flows
- Authentication and user management
- Camera and image processing features

For questions or issues with the e2e testing setup, refer to the official documentation:
- [Maestro Documentation](https://maestro.mobile.dev/)
- [Detox Documentation](https://wix.github.io/Detox/)