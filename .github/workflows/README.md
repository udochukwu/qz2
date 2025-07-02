# GitHub Actions Workflows for Maestro E2E Testing

This directory contains GitHub Actions workflows for running Maestro end-to-end tests on your React Native app.

## Available Workflows

### 1. `maestro-tests.yml` - Full Parallel Testing
- Runs iOS and Android tests in parallel
- Separate jobs for each platform
- Includes test summary and artifact collection
- Best for comprehensive testing

### 2. `maestro-simple.yml` - Matrix Testing
- Uses GitHub Actions matrix strategy
- Runs both platforms but in separate jobs
- Faster feedback with parallel execution
- Good for regular CI/CD

## How to Use

### Automatic Triggering
The workflows automatically run on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual trigger via GitHub Actions UI

### Manual Execution
1. Go to your repository's Actions tab
2. Select the workflow you want to run
3. Click "Run workflow"
4. Choose the branch and click "Run workflow"

## Configuration

### Prerequisites
- Your React Native app must be properly configured
- iOS: Requires Xcode workspace and scheme setup
- Android: Requires Gradle build configuration
- Maestro tests must be in `.maestro/` directory

### Environment Variables
The workflows use these environment variables:
- `MAESTRO_DRIVER_STARTUP_TIMEOUT`: 120000ms
- `MAESTRO_DRIVER_SHUTDOWN_TIMEOUT`: 30000ms
- `MAESTRO_DRIVER_HEADLESS`: true (for CI)
- `MAESTRO_DRIVER_QUIET`: true (for CI)

### Customization

#### iOS Configuration
- Simulator: iPhone 15 with latest iOS
- Build configuration: Debug
- Workspace: AIHomework.xcworkspace
- Scheme: AIHomework

#### Android Configuration
- API Level: 34
- Target: google_apis
- Emulator: Nexus 6
- Build variant: Debug

## Test Results

### Artifacts
- Test reports in JUnit XML format
- Screenshots on test failures
- Maestro reports directory

### Integration
- Test results are published to GitHub
- Available in the Actions tab
- Can be integrated with external tools

## Troubleshooting

### Common Issues

1. **iOS Build Failures**
   - Check Xcode workspace and scheme names
   - Ensure all iOS dependencies are properly installed
   - Verify Ruby version compatibility

2. **Android Build Failures**
   - Check Gradle configuration
   - Ensure Android SDK is properly set up
   - Verify Java version compatibility

3. **Maestro Test Failures**
   - Check app identifiers in `.maestro/config.yaml`
   - Verify test selectors and assertions
   - Review screenshots for UI changes

### Debugging
- Enable verbose logging in Maestro config
- Check workflow logs for detailed error messages
- Download artifacts to inspect test results

## Performance Optimization

### For Faster CI
1. Use the simple workflow for regular testing
2. Enable caching for dependencies
3. Use parallel execution where possible
4. Consider running only critical tests in PRs

### For Comprehensive Testing
1. Use the full workflow for releases
2. Run all test suites
3. Collect detailed reports
4. Enable retries for flaky tests

## Security Considerations

- Never commit sensitive data to test files
- Use GitHub Secrets for API keys and credentials
- Review test data for sensitive information
- Ensure test environments are isolated

## Support

For issues with the workflows:
1. Check the GitHub Actions documentation
2. Review Maestro documentation
3. Check workflow logs for specific errors
4. Consider updating dependencies if needed 