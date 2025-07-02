# E2E Testing Guidelines for Quizard Mobile App

This document provides guidelines and best practices for writing and maintaining end-to-end tests for the Quizard mobile application.

## Testing Philosophy

### Goals
- **Validate critical user journeys** end-to-end
- **Catch regressions** before they reach production
- **Ensure cross-platform consistency** between iOS and Android
- **Maintain test reliability** and reduce flakiness

### What to Test
✅ **Test These**:
- Critical user flows (onboarding, core features)
- Cross-screen navigation
- Form submissions and validations
- Payment and subscription flows
- Camera and image processing workflows
- Authentication and user management

❌ **Don't Test These**:
- Unit-level logic (use unit tests instead)
- Styling and visual appearance details
- Network error handling (mock at integration level)
- Performance characteristics (use dedicated performance tests)

## Framework Selection Guide

### Use Maestro When:
- Writing simple navigation and interaction tests
- Testing basic user flows
- Need fast test development and iteration
- Cross-platform consistency is important
- CI/CD integration is a priority

### Use Detox When:
- Need deep React Native integration
- Testing complex animations or timing-sensitive features
- Require advanced debugging capabilities
- Working with native modules extensively

## Test Structure and Organization

### File Naming Convention
```
.maestro/
├── basic-app-launch.yaml
├── onboarding-flow.yaml
├── quiz-creation.yaml
├── paywall-subscription.yaml
└── camera-workflow.yaml
```

### Test Case Structure (Maestro)
```yaml
# Feature: User Onboarding Flow
# Purpose: Validates complete user registration and setup
appId: com.aihomework
---
# Step 1: Launch and verify intro screen
- launchApp
- assertVisible: "Meet Quizard"

# Step 2: Navigate through onboarding
- tapOn: 
    testId: "intro-get-started-button"
- assertVisible: "Phone Verification"

# Step 3: Complete phone verification
- tapOn:
    testId: "phone-input-field"
- inputText: "+1234567890"
- tapOn:
    testId: "verify-phone-button"
```

### Test Case Structure (Detox)
```javascript
describe('User Onboarding Flow', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete user registration successfully', async () => {
    // Step 1: Launch and verify intro screen
    await expect(element(by.text('Meet Quizard'))).toBeVisible();
    
    // Step 2: Navigate through onboarding
    await element(by.id('intro-get-started-button')).tap();
    await expect(element(by.text('Phone Verification'))).toBeVisible();
    
    // Step 3: Complete phone verification
    await element(by.id('phone-input-field')).typeText('+1234567890');
    await element(by.id('verify-phone-button')).tap();
  });
});
```

## TestID Implementation Guidelines

### Naming Convention
Use descriptive, hierarchical names:
```
{screen}-{element}-{action/type}
```

Examples:
- `intro-get-started-button`
- `home-camera-button`
- `settings-logout-button`
- `quiz-submit-answer`
- `paywall-subscribe-monthly`

### Component Implementation
```typescript
// ✅ Good: Clear, descriptive testID
<PrimaryButton
  testID="quiz-submit-answer"
  text="Submit Answer"
  onPress={handleSubmit}
/>

// ❌ Bad: Generic or unclear testID
<PrimaryButton
  testID="button1"
  text="Submit Answer"
  onPress={handleSubmit}
/>
```

### TestID Placement Strategy
1. **Interactive Elements**: All buttons, inputs, touchable components
2. **Navigation Elements**: Tab bars, navigation buttons, modal close buttons
3. **Form Elements**: Input fields, dropdowns, checkboxes, radio buttons
4. **Content Containers**: Modals, screens, important content sections

## Element Selection Best Practices

### Selector Priority (Most to Least Reliable)
1. **testID** - Most reliable, platform-consistent
2. **Accessibility labels** - Good for screen reader compatibility
3. **Text content** - Fragile, language-dependent
4. **Coordinates** - Very fragile, avoid when possible

### Maestro Selectors
```yaml
# ✅ Preferred: testID selector
- tapOn:
    testId: "home-camera-button"

# ✅ Acceptable: Text selector for static content
- assertVisible: "Meet Quizard"

# ❌ Avoid: Coordinate-based selectors
- tapOn:
    point: "50%,80%"
```

### Detox Selectors
```javascript
// ✅ Preferred: testID selector
await element(by.id('home-camera-button')).tap();

// ✅ Acceptable: Text selector for static content
await expect(element(by.text('Meet Quizard'))).toBeVisible();

// ❌ Avoid: Complex matchers
await element(by.type('TouchableOpacity').withAncestor(by.id('container'))).tap();
```

## Test Data Management

### Static Test Data
```yaml
# Define test data at the top of test files
env:
  TEST_PHONE: "+1234567890"
  TEST_EMAIL: "test@example.com"
---
- inputText: ${TEST_PHONE}
```

### Dynamic Test Data
```javascript
// Generate unique test data
const testEmail = `test+${Date.now()}@example.com`;
await element(by.id('email-input')).typeText(testEmail);
```

## Waiting and Synchronization

### Maestro Waiting
```yaml
# Wait for element to appear
- assertVisible:
    text: "Loading complete"
    timeout: 10000

# Wait for element to disappear
- assertNotVisible:
    text: "Loading..."
    timeout: 5000
```

### Detox Waiting
```javascript
// Wait for element to be visible
await waitFor(element(by.text('Loading complete')))
  .toBeVisible()
  .withTimeout(10000);

// Wait for element to disappear
await waitFor(element(by.text('Loading...')))
  .not.toBeVisible()
  .withTimeout(5000);
```

## Error Handling and Debugging

### Maestro Debugging
```bash
# Run with debug output
maestro test --debug .maestro/test-file.yaml

# Take screenshots on failure (configured in config.yaml)
execution:
  screenshotOnFailure: true
```

### Detox Debugging
```javascript
// Add debug information
console.log('About to tap submit button');
await element(by.id('submit-button')).tap();

// Take manual screenshots
await device.takeScreenshot('before-submit');
```

## Test Maintenance

### Regular Maintenance Tasks
1. **Update testIDs** when component interfaces change
2. **Review test failures** and fix broken selectors
3. **Remove obsolete tests** for deprecated features
4. **Add tests** for new features and bug fixes

### Handling UI Changes
```yaml
# Before UI change
- tapOn:
    testId: "old-button-id"

# After UI change - update testID
- tapOn:
    testId: "new-button-id"
```

### Version Control Best Practices
1. **Commit test changes** with feature changes
2. **Use descriptive commit messages** for test updates
3. **Review test changes** in pull requests
4. **Document breaking changes** that affect tests

## Performance Considerations

### Test Execution Speed
- **Group related tests** in single files to reduce app launches
- **Use beforeEach sparingly** - prefer independent tests
- **Avoid unnecessary waits** - use specific assertions instead

### Resource Management
```javascript
// ✅ Good: Specific cleanup
afterEach(async () => {
  await device.clearKeychain();
});

// ❌ Avoid: Heavy cleanup that slows tests
afterEach(async () => {
  await device.uninstallApp();
  await device.installApp();
});
```

## Cross-Platform Considerations

### Platform-Specific Tests
```yaml
# iOS-specific test
appId: com.aihomework
platforms: [iOS]
---
- tapOn:
    testId: "ios-specific-button"

# Android-specific test  
appId: com.aihomework
platforms: [Android]
---
- tapOn:
    testId: "android-specific-button"
```

### Platform Differences
- **Navigation patterns** may differ between platforms
- **Keyboard behavior** varies between iOS and Android
- **Permission dialogs** appear differently
- **Animation timing** may need platform-specific waits

## Common Patterns and Examples

### Modal Interactions
```yaml
# Open modal
- tapOn:
    testId: "open-modal-button"
- assertVisible:
    testId: "modal-container"

# Interact with modal content
- tapOn:
    testId: "modal-confirm-button"

# Verify modal closed
- assertNotVisible:
    testId: "modal-container"
```

### Form Filling
```yaml
# Fill form fields
- tapOn:
    testId: "name-input"
- inputText: "John Doe"

- tapOn:
    testId: "email-input"
- inputText: "john@example.com"

# Submit form
- tapOn:
    testId: "submit-form-button"

# Verify success
- assertVisible: "Form submitted successfully"
```

### Navigation Testing
```yaml
# Tab navigation
- tapOn:
    testId: "tab-calculator"
- assertVisible: "Calculator"

- tapOn:
    testId: "tab-home"
- assertVisible: "Meet Quizard"
```

## Review Checklist

Before submitting test changes, verify:

- [ ] **TestIDs are descriptive** and follow naming convention
- [ ] **Tests are independent** and don't rely on previous test state
- [ ] **Assertions are specific** and meaningful
- [ ] **Waits are appropriate** - not too short or too long
- [ ] **Error messages are clear** when tests fail
- [ ] **Tests work on both platforms** (iOS and Android)
- [ ] **Documentation is updated** for new test patterns
- [ ] **Test files are properly organized** and named

## Resources

- [Maestro Documentation](https://maestro.mobile.dev/)
- [Detox Documentation](https://wix.github.io/Detox/)
- [React Native Testing Best Practices](https://reactnative.dev/docs/testing-overview)
- [E2E Testing Setup Guide](./E2E_TESTING_SETUP.md)