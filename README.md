# Sync Consulting

Standalone marketing site for **Sync Consulting** with a visual page builder (Puck). Layout is one JSON document: edit in Admin, save to `public/layout.json`, and the public page renders the same component catalog.

## Stack

- Vite + React 19 + TypeScript
- React Router
- [@puckeditor/core](https://puckeditor.com/) visual editor
- Koa CMS API (reads and writes `public/layout.json`)

## Develop

```bash
npm install
npm start
```

`npm start` runs the CMS API on port `9000` and Vite on `5174`. App: [http://127.0.0.1:5174/sync-app/](http://127.0.0.1:5174/sync-app/) (`base: /sync-app/` so it can mount under the portfolio origin).

- Public site: `/sync-app/`
- Layout manager: `/sync-app/#/admin-edit-mode`

Use `npm run dev` alone only if you do not need to save. The public page still loads `layout.json` without the CMS server.

### Portfolio (Website) embed

In the sibling [Website](../Website) portfolio:

1. Start this app on port `5174`
2. Start Website (`yarn dev` / `npm run dev`)
3. Open `/sync-consulting` — it iframes `/sync-app/` through the Website Vite proxy

## Persist layout

Copy and layout live in one Puck JSON document, [`public/layout.json`](public/layout.json):

- Admin autosave: `PUT /cms-api/layout` writes `public/layout.json` (included in `vite build`)
- Public site reads `/sync-app/layout.json`
- Admin toolbar: **Save**, **View site**, **Export JSON**, **Import JSON**

If the CMS server is down, Admin still edits in memory; export JSON to keep work.

## Production

Build:

```bash
npm run build
```

Serve `dist/` under the path `/sync-app/` on the same origin as the portfolio (e.g. Caddy `handle_path /sync-app/*`). That matches the Puppies `/api` proxy pattern: same-origin access from `/sync-consulting`.

## Git remote

Local `main` has an initial commit. Creating a Cursor-hosted remote needs an Origin namespace on the account (`origin repo create` currently errors: *Your account has no Origin namespace yet*). After a namespace is available at [cursor.com/codebase](https://cursor.com/codebase):

```bash
~/.local/bin/origin repo create <namespace>/sync-consulting
git remote add origin <clone-url>
git push -u origin main
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm start` | CMS API (9000) + Vite (5174) |
| `npm run cms` | Koa layout API on port 9000 |
| `npm run dev` | Vite only, port 5174 |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build on 5174 |
| `npm run lint` | Oxlint |
