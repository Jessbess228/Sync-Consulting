# Sync Consulting

Standalone marketing site for **Sync Consulting** with a full visual page builder (Puck). Edit layout, copy, and look from Admin; the public page renders the same component catalog from saved JSON.

## Stack

- Vite + React 19 + TypeScript
- React Router
- [@puckeditor/core](https://puckeditor.com/) visual editor

## Develop

```bash
npm install
npm run dev
```

App runs at [http://127.0.0.1:5174/sync-app/](http://127.0.0.1:5174/sync-app/) (`base: /sync-app/` so it can mount under the portfolio origin).

- Public site: `/sync-app/`
- Layout manager: `/sync-app/admin` (or the floating **Admin** button)

### Portfolio (Website) embed

In the sibling [Website](../Website) portfolio:

1. Start this app on port `5174`
2. Start Website (`yarn dev` / `npm run dev`)
3. Open `/sync-consulting` — it iframes `/sync-app/` through the Website Vite proxy

## Persist layout

- Saves to `localStorage` key `sync-consulting-layout`
- Admin toolbar: **Save**, **View site**, **Reset to default**, **Export JSON**, **Import JSON**

## Production

Build:

```bash
npm run build
```

Serve `dist/` under the path `/sync-app/` on the same origin as the portfolio (e.g. Caddy `handle_path /sync-app/*`). That matches the Puppies `/api` proxy pattern: same-origin access from `/sync-consulting`.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server on port 5174 |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build on 5174 |
| `npm run lint` | Oxlint |
