# WAICT Demo Server

A developer-facing demo server for testing the Firefox WAICT implementation. Runs on Cloudflare Pages with Workers functions. Supports enforce mode, report mode, and navigation tests.

## Run locally

```bash
npm run dev
```

This starts the Wrangler dev server (typically `http://localhost:8788`).

## Deploy

Push to a branch connected to Cloudflare Pages, or deploy manually:

```bash
npx wrangler pages deploy public/
```

## Project structure

- `public/` — static assets served by Cloudflare Pages
  - `_headers` — sets `Integrity-Policy-WAICT-v1` and `Reporting-Endpoints` headers per route
  - `_redirects` — rewrites `/nav/page1` and `/nav/page2` to their HTML files
  - `waict-manifest*.json` — WAICT manifests with resource hashes
- `functions/` — Cloudflare Pages Functions (serverless endpoints)
  - `log.js` — `POST /log` — logs WAICT violations to the console
  - `reports.js` — `POST /reports` and `GET /reports` — collects and returns violation reports

## Prerequisites

Enable the following prefs in Firefox `about:config`:

- `security.waict.enabled` — enables WAICT enforcement
- `dom.reporting.enabled` — enables `ReportingObserver`, required for the violation reports UI

---

Pictures used in this repository are AI-generated.
