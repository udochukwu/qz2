/* global describe, beforeAll, beforeEach, it */
const { device, expect, element, by } = require('detox');

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have welcome screen', async () => {
    await expect(element(by.text('Meet Quizard'))).toBeVisible();
  });

  it('should show intro screen after tap', async () => {
    await element(by.id('intro-get-started-button')).tap();
    await expect(element(by.text('Loading'))).toBeVisible();
  });
});