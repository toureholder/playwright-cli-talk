import { test, expect, type Locator } from '@playwright/test';

const PAGE_URL = 'https://www.nfl.com/international';
const HEADLINE_STACK_SELECTOR = '#HeadlineStack-31';

async function dismissOverlay(overlay: Locator, dismissButton: Locator, timeout: number) {
  try {
    await overlay.waitFor({ state: 'visible', timeout });
    await dismissButton.click();
    await overlay.waitFor({ state: 'hidden', timeout: 5000 });
  } catch {
    // Overlay never appeared for this run; nothing to dismiss.
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded' });
  // The page can show a cookie consent banner and a push-notification prompt
  // that intercept clicks on the section below, so clear them first.
  const cookieBanner = page.locator('#onetrust-banner-sdk');
  await dismissOverlay(cookieBanner, cookieBanner.getByRole('button', { name: 'Accept Cookies' }), 10000);

  const pushPrompt = page.locator('#onesignal-slidedown-container');
  await dismissOverlay(pushPrompt, page.locator('#onesignal-slidedown-cancel-button'), 5000);
});

test.describe('Headline Stack (#HeadlineStack-31)', () => {
  // Runs against the live site; avoid hammering it with concurrent contexts.
  test.describe.configure({ mode: 'serial' });

  test('renders with the News tab selected and lists headline links', async ({ page }) => {
    const headlineStack = page.locator(HEADLINE_STACK_SELECTOR);
    await expect(headlineStack).toBeVisible();

    const newsTab = headlineStack.getByRole('tab', { name: 'NEWS' });
    const myTeamTab = headlineStack.getByRole('tab', { name: 'MY TEAM' });
    await expect(newsTab).toHaveAttribute('aria-selected', 'true');
    await expect(myTeamTab).toHaveAttribute('aria-selected', 'false');

    const newsPanel = headlineStack.getByRole('tabpanel', { name: 'NEWS' });
    const headlineLinks = newsPanel.getByRole('list').getByRole('link');
    await expect(headlineLinks.first()).toBeVisible();
    expect(await headlineLinks.count()).toBeGreaterThan(0);

    const moreNewsLink = headlineStack.getByRole('link', { name: /More News/ });
    await expect(moreNewsLink).toBeVisible();
    await expect(moreNewsLink).toHaveAttribute('href', '/news');
  });

  test('switches to the My Team tab by click and back to News by keyboard', async ({ page }) => {
    const headlineStack = page.locator(HEADLINE_STACK_SELECTOR);
    const newsTab = headlineStack.getByRole('tab', { name: 'NEWS' });
    const myTeamTab = headlineStack.getByRole('tab', { name: 'MY TEAM' });

    await myTeamTab.click();
    await expect(myTeamTab).toHaveAttribute('aria-selected', 'true');
    await expect(newsTab).toHaveAttribute('aria-selected', 'false');

    const myTeamPanel = headlineStack.getByRole('tabpanel', { name: 'MY TEAM' });
    await expect(myTeamPanel).toBeVisible();
    await expect(myTeamPanel.getByText(/sign up or sign in/i)).toBeVisible();
    await expect(myTeamPanel.getByRole('link', { name: 'SIGN IN' })).toBeVisible();
    await expect(myTeamPanel.getByRole('button', { name: 'SIGN UP' })).toBeVisible();

    // Tabs follow the ARIA tabs pattern: arrow keys move selection between them.
    await page.keyboard.press('ArrowLeft');
    await expect(newsTab).toHaveAttribute('aria-selected', 'true');
    await expect(headlineStack.getByRole('tabpanel', { name: 'NEWS' })).toBeVisible();
  });

  test('navigates to an article when a headline link is clicked', async ({ page }) => {
    const headlineStack = page.locator(HEADLINE_STACK_SELECTOR);
    const newsPanel = headlineStack.getByRole('tabpanel', { name: 'NEWS' });
    const firstArticle = newsPanel.getByRole('list').getByRole('link').first();

    const articleHref = await firstArticle.getAttribute('href');
    expect(articleHref).toBeTruthy();

    await firstArticle.click();

    await expect(page).toHaveURL(articleHref!);
    const articleHeading = page.getByRole('heading', { level: 1 });
    await expect(articleHeading).toBeVisible();
    await expect(articleHeading).not.toBeEmpty();
  });

  test('navigates to the full news list via the More News link', async ({ page }) => {
    const headlineStack = page.locator(HEADLINE_STACK_SELECTOR);
    const moreNewsLink = headlineStack.getByRole('link', { name: /More News/ });

    await moreNewsLink.click();

    await expect(page).toHaveURL('https://www.nfl.com/news');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
