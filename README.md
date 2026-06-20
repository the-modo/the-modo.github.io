<div align="center">

<img src="public/logo.svg" width="80" alt="Modo AI Gateway"/>

# Modo AI Gateway — Landing Site

The official marketing site for [Modo AI Gateway](https://github.com/the-modo/ai-gateway).
Live at **https://the-modo.github.io/**.

[![License: Non-Commercial](https://img.shields.io/badge/License-Non--Commercial-amber.svg)](https://github.com/the-modo/ai-gateway/blob/main/LICENSE)

</div>

---

> ## ⚠ Non-commercial use only
>
> The Modo AI Gateway product is distributed for **non-commercial use only**.
> Commercial deployments require a separate commercial license — please
> [contact us](https://the-modo.github.io/#contact) *before* going to production.
> Full terms: [LICENSE](https://github.com/the-modo/ai-gateway/blob/main/LICENSE).

---

## What's here

This repository is a static Next.js site. On every push to `main`, GitHub
Actions runs `npm run build` and publishes `out/` to GitHub Pages.

- **Hero, features, product tour, workflows, license, contact** — all client-side React, no backend at request time
- **Real dashboard screenshots and recordings** under `public/screenshots/`
- **Forms** (`/download`, `#contact`) POST to a Python backend over HTTPS that sends mail via Gmail SMTP

## Stack

- Next.js 14 (`output: 'export'`) → static HTML/CSS/JS
- Tailwind utility classes + a thin custom CSS layer for the aurora aesthetic
- Lucide icons, plain `<video>` elements with first-frame MP4 posters
- GitHub Actions → GitHub Pages (workflow in `.github/workflows/deploy.yml`)

## Develop

```bash
npm install
npm run dev   # http://localhost:3000
```

## Build

```bash
npm run build     # static export → out/
```

## Regenerate screenshots

Real captures from the live dashboard via Playwright. Requires an SSH tunnel
to a running gateway (the script uses `localhost:8090` by default):

```bash
ssh -L 8090:localhost:4892 -L 4891:localhost:4891 dilan@your-server
node scripts/capture.mjs        # all dashboard pages
node scripts/capture-hero.mjs   # canvas-only HD hero
```

## The product

The actual Modo AI Gateway lives at
[github.com/the-modo/ai-gateway](https://github.com/the-modo/ai-gateway) —
see its README for features and the [SETUP guide](https://github.com/the-modo/ai-gateway/blob/main/SETUP.md)
for installation.

---

© Modo AI Gateway. All rights reserved. Free for non-commercial use.
