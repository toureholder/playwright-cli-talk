# Playwright CLI Talk

An educational toy project that shows how [Claude Code Skills](https://docs.claude.com/en/docs/claude-code/skills) can drive [Playwright](https://playwright.dev/) — both for exploring a live web page from the terminal and for generating maintainable, Page Object Model-based tests.

This repo was built incrementally as a talk demo. The commit history tells that story:

1. **Scaffold** a TypeScript Playwright test suite.
2. Add the **`playwright-cli` skill** — lets Claude drive a real browser step by step (open, snapshot, click, fill, screenshot, etc.) to explore a page before writing any test.
3. Use that exploration to write real tests against live pages on `nfl.com` (a headline carousel, a sign-in flow).
4. Add the **`playwright-pom` skill** — enforces the Page Object Model pattern (one class per file, specs stay free of raw locators) for any test Claude generates from here on.
5. Add a reverse-engineered Jira ticket ([`docs/drive-chart-ticket.md`](docs/drive-chart-ticket.md)) as an example of turning page exploration into a spec-writing artifact.

## What's here

```
.claude/skills/
  playwright-cli/   # Skill: browser automation via the playwright-cli tool
  playwright-pom/   # Skill: write/refactor tests using the Page Object Model
tests/
  pages/            # Page Object Model classes (*.page.ts)
  *.spec.ts         # Playwright specs, importing POM classes only
docs/
  drive-chart-ticket.md  # Example reverse-engineered ticket from live-page exploration
```

## Prerequisites

- Node.js
- [Yarn](https://yarnpkg.com/)

## Setup

```bash
yarn install
npx playwright install
```

## Running the tests

```bash
npx playwright test          # run all tests headless
npx playwright test --headed # run with a visible browser
npx playwright show-report   # view the HTML report from the last run
```

## The skills

- **`playwright-cli`** — a Claude Code skill for driving a real browser from the terminal (navigate, click, fill, snapshot, screenshot) to explore a page's structure before automating or testing it.
- **`playwright-pom`** — a Claude Code skill that enforces the Page Object Model when Claude writes or refactors Playwright tests in this project: locators and interactions live in a dedicated `*.page.ts` class, and spec files only ever import and call POM methods.

See `.claude/skills/*/SKILL.md` for the full instructions given to Claude.
