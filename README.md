# Modo AI Gateway — Landing site

Marketing site for **Modo AI Gateway** — the open-source AI gateway in Rust.

Static Next.js site, deployed to GitHub Pages by the workflow in
`.github/workflows/deploy.yml` on every push to `main`.

Live at **https://the-modo.github.io/ai-gateway-landing/**.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Static output goes to `out/`. The workflow uploads that as the Pages artifact.

## Backend

The contact form and download-request flow live in a separate service —
[ai-gateway-landing-backend](https://github.com/the-modo/ai-gateway-landing-backend).

Override the API base at build time with the repository variable
`NEXT_PUBLIC_API_BASE` (Settings → Secrets and variables → Actions → Variables).

## Screenshots

Real dashboard captures live in `public/screenshots/`. They were recorded
with `scripts/capture.mjs` against an SSH-tunneled dashboard; see that file
if you need to regenerate them.
