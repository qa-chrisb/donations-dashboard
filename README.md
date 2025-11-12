# Donations Dashboard

A deliberately small Astro build that showcases how I approach philanthropy telemetry: typed ingest, static hosting, and UI polish without noise.

## Highlights

- **Data-first:** `src/lib/donationFeed.ts` normalises mixed provider payloads, applies refund maths, and exposes a clean shape for widgets.
- **Static by default:** Everything compiles to static assets so the demo deploys anywhere from GitHub Pages to a basic CDN.
- **Accessible visuals:** Preact renders only the sparkline (`client:idle`), keeping the bundle tiny while still hinting at movement.
- **Modern stack:** Astro 4, Tailwind 3, and Bun 1 power the build; no legacy dependencies or opaque scripts.

## Quick start

```bash
bun install
bun run dev
```

Visit <http://localhost:4321> and the dashboard will stream from `public/data/donations.json`.

## Production build & checks

```bash
bun run check      # astro type-level checks (mirrors CI "tests")
bun run build      # static assets in dist/
bunx prettier --write .
```

## Feeding your own data

Drop a JSON file under `public/data/donations.json` (or point the widget at any URL). The loader understands both:

```json
{
  "id": "1",
  "name": "Ada",
  "date": "2025-08-24T10:00:00Z",
  "amount": 12.5,
  "currency": "GBP"
}
```

_and_

```json
{
  "id": "abc",
  "provider": "stripe",
  "occurred_at": "2025-08-24T10:00:00Z",
  "amount_minor": 1250,
  "currency": "GBP",
  "status": "SUCCEEDED"
}
```

Refunded rows are rendered in rose, everything else in emerald.

## Why this repo

I use this project in my portfolio because it is honest about scope: a single page that still demonstrates typed data handling, tasteful UI framing, and production-ready build scripts.
