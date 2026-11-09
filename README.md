# Sync Consulting

Standalone marketing site for **Sync Consulting** with a visual page builder (Puck). Layout is one JSON document: edit in Admin, save to `public/layout.json`, and the public page renders the same component catalog.

## Stack

- Vite + React 19 + TypeScript
- React Router
- [@puckeditor/core](https://puckeditor.com/) visual editor
- Koa CMS API (writes `public/layout.json`)

## Develop

```bash
npm install
npm start
```

`npm start` runs the CMS API on port `9000` and Vite on `5174`. App: [http://127.0.0.1:5174/website-builder/](http://127.0.0.1:5174/website-builder/) (`base: /website-builder/` so it can mount under the portfolio origin).

- Public site: `/website-builder/`
- Layout manager: pencil icon on the public site, then password (`CMS_PASSWORD` in `.env`, default `studio`)

Copy `.env.example` to `.env` to set the password. Restart `npm start` after changing it.

Use `npm run dev` alone only if you do not need to save. The public page still loads `layout.json` without the CMS server.

### Portfolio (Website) embed

In the sibling [Website](../Website) portfolio:

1. Start this app on port `5174`
2. Start Website (`yarn dev` / `npm run dev`)
3. Open `/website-builder` — it iframes `/website-builder/` through the Website Vite proxy

## Persist layout

Copy and layout live in one Puck JSON document, [`public/layout.json`](public/layout.json):

- Admin **Save** writes `public/layout.json` via `PUT /cms-api/layout` (included in `vite build`)
- Public site reads `/website-builder/layout.json`
- Admin toolbar: **Save**, **View site**

If the CMS server is down, Admin still edits in memory until you can save.

## Production

Build:

```bash
npm run build
```

### Google Cloud Run (recommended with portfolio on GCP)

This repo includes a `Dockerfile` that serves:

- `/website-builder/` — Vite `dist` (built with `base: /website-builder/`)
- `/cms-api` — Koa CMS (layout save, login, bookings)

Deploy as its **own** Cloud Run service, then set `SYNC_APP_ORIGIN` on the [Website](../Website) portfolio service to this service’s URL. The portfolio iframe uses `/website-builder/` on the **same origin**; nginx on the portfolio container proxies those paths to `SYNC_APP_ORIGIN`.

Example:

```bash
export PROJECT_ID=your-gcp-project
export REGION=australia-southeast1

gcloud builds submit --tag "gcr.io/${PROJECT_ID}/website-builder" .
gcloud run deploy website-builder \
  --image "gcr.io/${PROJECT_ID}/website-builder" \
  --region "${REGION}" \
  --allow-unauthenticated \
  --set-env-vars "CMS_PASSWORD=studio,SMTP_USER=...,SMTP_PASS=..."
```

Set booking mail vars from `.env.example` if you need the contact form to send email.

**Note:** layout saves write to `public/layout.json` inside the container. On Cloud Run that file is lost when the instance is recycled unless you add persistent storage.

### EC2 / Caddy (legacy)

Serve `dist/` under `/website-builder/` on the same origin as the portfolio (e.g. Caddy `handle_path /website-builder/*`), and proxy `/cms-api` to the Koa server on port `5556`.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm start` | CMS API (9000) + Vite (5174) |
| `npm run cms` | Koa layout API on port 9000 |
| `npm run dev` | Vite only, port 5174 |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build on 5174 |
| `npm run lint` | Oxlint |
