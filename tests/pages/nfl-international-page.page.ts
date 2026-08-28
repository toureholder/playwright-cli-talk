import { type Locator, type Page } from '@playwright/test';

const PAGE_URL = 'https://www.nfl.com/international';

export class NflInternationalPage {
  readonly page: Page;
  readonly signInButton: Locator;
  readonly cookieBanner: Locator;
  readonly acceptCookiesButton: Locator;
  readonly pushNotificationPrompt: Locator;
  readonly dismissPushNotificationButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInButton = page.getByTestId('header-section').getByRole('button', { name: 'Sign In' });
    this.cookieBanner = page.locator('#onetrust-banner-sdk');
    this.acceptCookiesButton = this.cookieBanner.getByRole('button', { name: 'Accept Cookies' });
    this.pushNotificationPrompt = page.locator('#onesignal-slidedown-container');
    this.dismissPushNotificationButton = page.locator('#onesignal-slidedown-cancel-button');
  }

  async goto() {
    await this.page.goto(PAGE_URL, { waitUntil: 'domcontentloaded' });
    // The page can show a cookie consent banner and a push-notification prompt
    // that intercept clicks; clear them so later interactions aren't blocked.
    await this.dismissOverlay(this.cookieBanner, this.acceptCookiesButton, 10000);
    await this.dismissOverlay(this.pushNotificationPrompt, this.dismissPushNotificationButton, 5000);
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  private async dismissOverlay(overlay: Locator, dismissButton: Locator, timeout: number) {
    try {
      await overlay.waitFor({ state: 'visible', timeout });
      await dismissButton.click();
      await overlay.waitFor({ state: 'hidden', timeout: 5000 });
    } catch {
      // Overlay never appeared for this run; nothing to dismiss.
    }
  }
}
