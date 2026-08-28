## Summary
Drive Chart component (`#DriveChart-1`) — Scoring/All Drives tabs with expandable play-by-play

**Type:** Story
**Component:** Game Center — Recap tab
**Labels:** `game-center`, `drive-chart`, `ui`

## Description

The Drive Chart is a module on the Game Center **Recap** tab (`https://www.nfl.com/games/{slug}?tab=recap`) that summarizes every offensive drive of the game and lets fans drill into the play-by-play for any individual drive.

The component has two views, switched via a tab control:
- **SCORING DRIVES** (default) — only drives that ended in a score (TD/FG)
- **ALL DRIVES** — every drive of the game, including punts, turnovers, and end-of-half/game drives

Within each tab, drives are grouped under quarter headers (`1ST QUARTER`, `2ND QUARTER`, etc.) in chronological order. Each drive renders as a collapsed row (accordion) showing:
- Possessing team's logo
- Drive result label (e.g. `Touchdown`, `Field Goal`, `Punt`)
- Summary stats: `PLAYS`, `YDS`, `TTL TIME` (time of possession)
- Running score (away–home) as of the end of that drive

Clicking/tapping a drive row expands it to reveal the full play-by-play log for that drive — each play shows a short result tag (e.g. `2 Yard Pass`, `Pass Incomplete`), down & distance, the game clock/quarter, and the full text description of the play (e.g. *"S.Buechele pass short left to M.Hardman to BUF 29 for 2 yards (R.Spears-Jennings)."*). Expand/collapse is independent per drive — multiple drives can be open at once.

On mobile breakpoints, an additional chevron icon is shown next to the drive result to indicate expand state (rotates 180° when open); this icon is hidden at `md` and above, where the row itself communicates state via styling.

## Acceptance Criteria

- [ ] The Drive Chart section is visible on the Recap tab with an accessible (if visually hidden) heading identifying it as "Drive Chart"
- [ ] A tablist with two tabs, `SCORING DRIVES` and `ALL DRIVES`, is rendered; `SCORING DRIVES` is selected by default (`aria-selected="true"`)
- [ ] Switching tabs updates `aria-selected` on both tabs and swaps the visible list of drives without a full page reload
- [ ] `SCORING DRIVES` shows only drives ending in a score (Touchdown/Field Goal); `ALL DRIVES` shows every drive of the game
- [ ] Drives are grouped under quarter headers, in chronological order within each quarter
- [ ] Each collapsed drive row displays: possession team logo, drive result, `PLAYS` count, `YDS`, `TTL TIME`, and the score after the drive
- [ ] Clicking a drive row toggles `aria-expanded` on its trigger button and reveals/hides a play-by-play list scoped to that drive
- [ ] Each play in the expanded list shows a result tag, down & distance, game clock, and a full text description of the play
- [ ] Multiple drives can be expanded simultaneously (expanding one does not collapse another)
- [ ] Drive rows are keyboard-operable: focusable via Tab, toggle via Enter/Space, with correct ARIA `button`/`aria-expanded`/`aria-controls` semantics
- [ ] On mobile viewports, a chevron indicator next to the drive result reflects expand/collapse state

## Test Steps

1. Navigate to `https://www.nfl.com/games/{away}-at-{home}-{season}-{week}?tab=recap` for a completed game and dismiss the cookie consent banner.
2. Locate the section with `id="DriveChart-1"`. **Verify** it is visible and contains a tablist with `SCORING DRIVES` and `ALL DRIVES` tabs.
3. **Verify** `SCORING DRIVES` is selected by default and its panel lists only drives ending in a score, grouped by quarter.
4. Click the `ALL DRIVES` tab. **Verify** the tab selection state updates and the panel now includes non-scoring drives (e.g. `Punt`).
5. In either tab, note the collapsed summary (result, `PLAYS`, `YDS`, `TTL TIME`, score) for the first drive, then click its row.
6. **Verify** `aria-expanded` on the row's button changes to `true` and a play-by-play list appears, with each play showing a result tag, down & distance, clock, and description text.
7. Click a second drive row without collapsing the first. **Verify** both drives remain expanded simultaneously.
8. Click the first drive's row again. **Verify** it collapses (`aria-expanded="false"`) while the second drive remains expanded.
9. Tab through the drive rows via keyboard and press Enter/Space on a focused row. **Verify** it toggles expand/collapse identically to a mouse click.
10. Resize to a mobile viewport width. **Verify** the chevron icon next to the drive result appears and rotates when the row is expanded.
