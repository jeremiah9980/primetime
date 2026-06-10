# Primetime 10U · NCS State Command

Tournament-day dashboard for the **2026 Central Texas NCS 10U Summer State (Triple Points) OPEN** event
(NCS Event 12472 · 10U OPEN · Taylor Athletic Complex · Jun 13–14, 2026).

Saturday pool schedule + results, live "next game" countdown, computed standings, and a Sunday bracket
tab — all defaulted to **Primetime 10u** (team 71355), with a dropdown to watch any team in the division.

## How it stays live

The dashboard is static and can't scrape NCS from the browser (CORS). Instead:

```
GitHub Action (every ~10 min)  ->  scraper/ncs_scrape.py  ->  data/schedule.json  ->  dashboard auto-loads it
```

The page ships with the full schedule baked in, so it works immediately even before the Action runs.

## Repo layout

```
index.html                      # the dashboard (GitHub Pages serves this)
data/schedule.json              # results file (Action overwrites this)
scraper/ncs_scrape.py           # NCS -> schedule.json
scraper/requirements.txt
.github/workflows/ncs-update.yml
```

## Deploy (5 min)

1. Push these files to a repo (e.g. `primetime-ncs`).
2. **Settings → Pages →** Deploy from branch, `main` / root. Your site: `https://jeremiah9980.github.io/primetime-ncs/`
3. **Settings → Actions → General →** Workflow permissions → **Read and write**.
4. **Actions** tab → run **NCS Results Sync** once to confirm it writes `data/schedule.json`. After that the cron keeps it fresh on game days.

## Tweaks

- Different team default: change `CONFIG.myTeamId` in `index.html`.
- New event next weekend: update `SCHEDULE_URL` + `DATE_MAP` in `ncs_scrape.py`, and the `SEED`/`EVENT` block in `index.html`.
- Team colors: edit `--team` / `--team2` CSS variables.
- Manual score entry (the "Score" button on each game) is session-only; the durable source is the scraped JSON.

## Note on the scraper

Score parsing handles NCS's "final" layout defensively, but NCS only renders scores once games go final —
run the Action once during Saturday pool play and confirm the first finals parse cleanly. If their markup
shifts, the `parse_team_cell()` function is the one spot to adjust.
