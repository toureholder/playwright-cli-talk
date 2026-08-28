import { test } from '@playwright/test';
import { NflInternationalPage } from './pages/nfl-international-page.page';
import { NflSignInPage } from './pages/nfl-sign-in-page.page';

test.use({ headless: false });

test.describe('Sign In button', () => {
  test('takes the user to the NFL Account Sign In page', async ({ page }) => {
    const nflInternational = new NflInternationalPage(page);
    await nflInternational.goto();

    await nflInternational.clickSignIn();

    const signIn = new NflSignInPage(page);
    await signIn.expectDisplayed();
  });
});
