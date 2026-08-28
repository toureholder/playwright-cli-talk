---
name: playwright-pom
description: Write or refactor Playwright tests using the Page Object Model (POM) pattern — each POM class lives in its own file, separate from the spec file. Use whenever creating, generating, or restructuring Playwright tests in this project.
allowed-tools: Read Write Edit Bash(npx:*) Bash(npm:*)
---

# Playwright Page Object Model (POM)

Reference: https://playwright.dev/docs/pom

Page objects encapsulate a page (or a reusable component within a page) as a class:
locators live in the constructor, interactions live in methods. Specs then read like
user stories instead of low-level Playwright calls. This also centralizes selectors —
when the app changes, fix one class instead of every spec that touches it.

## Non-negotiable file rule

**Every POM class gets its own dedicated file. Never define a POM class inside a
`*.spec.ts` file, and never put more than one POM class in the same file** — even for
small or closely related components.

- POM files live in `tests/pages/`.
- File name: kebab-case of the class name, suffixed with `.page.ts`
  (`LoginPage` → `tests/pages/login-page.page.ts`).
- Class name: PascalCase, suffixed with `Page`
  (`LoginPage`, `HeadlineStackPage`, `CheckoutPage`).
- A spec file only ever `import`s POM classes — it must not contain `page.locator(...)`,
  `page.getByRole(...)`, etc. directly. If a spec needs a raw locator, that locator
  belongs on a POM instead.

## POM class shape

```typescript
// tests/pages/playwright-dev.page.ts
import { expect, type Locator, type Page } from '@playwright/test';

export class PlaywrightDevPage {
  readonly page: Page;
  readonly getStartedLink: Locator;
  readonly gettingStartedHeader: Locator;
  readonly pomLink: Locator;
  readonly tocList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedLink = page.locator('a', { hasText: 'Get started' });
    this.gettingStartedHeader = page.locator('h1', { hasText: 'Installation' });
    this.pomLink = page
      .locator('li', { hasText: 'Guides' })
      .locator('a', { hasText: 'Page Object Model' });
    this.tocList = page.locator('article div.markdown ul > li > a');
  }

  async goto() {
    await this.page.goto('https://playwright.dev');
  }

  async getStarted() {
    await this.getStartedLink.first().click();
    await expect(this.gettingStartedHeader).toBeVisible();
  }

  async pageObjectModel() {
    await this.getStarted();
    await this.pomLink.click();
  }
}
```

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';
import { PlaywrightDevPage } from './pages/playwright-dev.page';

test('getting started should contain table of contents', async ({ page }) => {
  const playwrightDev = new PlaywrightDevPage(page);
  await playwrightDev.goto();
  await playwrightDev.getStarted();
  await expect(playwrightDev.tocList).toHaveText([
    `How to install Playwright`,
    `What's installed`,
  ]);
});

test('should show Page Object Model article', async ({ page }) => {
  const playwrightDev = new PlaywrightDevPage(page);
  await playwrightDev.goto();
  await playwrightDev.pageObjectModel();
  await expect(page.locator('article')).toContainText('Page Object Model is a common pattern');
});
```

### Rules for the class

- Constructor takes `page: Page` and only assigns `this.page` plus `readonly Locator`
  properties — no navigation or assertions in the constructor.
- Declare every property `readonly` and typed (`Locator` or `Page`), imported from
  `@playwright/test`.
- One method per user action or page-level query (`goto`, `login`, `addTodo`,
  `getVisibleItems`). Method names read as verbs from the user's perspective, not as
  wrappers around a single Playwright call (`click()`).
- An assertion belongs in the POM method only when it verifies the *action itself
  succeeded* (e.g. `getStarted()` confirms the header is visible after navigating).
  Business/test-specific assertions (the actual thing the test is checking) stay in the
  spec file.
- If a page has distinct regions or repeated components (a nav bar, a modal, a card
  list item), give each its own POM class/file and compose them — e.g. `LoginPage`
  holds a `readonly nav: NavBarPage` built from a shared `NavBarPage` file — rather than
  cramming every locator into one class.

## Workflow

1. **New test, no POM yet**: create the POM file(s) under `tests/pages/` first, then
   write the spec that imports and drives them.
2. **Existing spec with inline locators**: extract every `page.locator(...)` /
   `page.getByRole(...)` call into a new POM class file, replace the spec's direct calls
   with calls to the POM's methods/locators, and confirm the test still passes.
3. **Generating tests with `playwright-cli`** (see the `playwright-cli` skill's
   `references/test-generation.md`): collect the generated Playwright code as usual,
   then place locators/actions on a POM class in its own file instead of inlining them
   into the spec.
4. After writing or editing a POM, run the affected spec to confirm it still passes:
   ```bash
   npx playwright test <spec-file>
   ```
