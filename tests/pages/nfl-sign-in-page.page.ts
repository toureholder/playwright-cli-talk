import { expect, type Locator, type Page } from '@playwright/test';

const SIGN_IN_URL_PATTERN = /id\.nfl\.com\/account\/sign-in/;

export class NflSignInPage {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Sign in to your NFL Account' });
  }

  async expectDisplayed() {
    await expect(this.page).toHaveURL(SIGN_IN_URL_PATTERN);
    await expect(this.heading).toBeVisible();
  }
}
