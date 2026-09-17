# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Personal profile/portfolio site for Leonid Livshyts, an 11th-grade student engineer at Brobots (Kyiv) who works on embedded systems, electronics and web. Plain JavaScript/JSX, no TypeScript. The foundation is implemented per `docs/superpowers/plans/2026-09-16-profile-site-foundation.md`.

Site (see the plan for history and rationale):
- **Design:** yellow / black / white only (`#FFD60A`, `#0A0A0A`, `#FFFFFF` plus grays). No yellow text on white.
- **Pages:** shared Header and Footer, then About (`/`), Projects (`/projects`), Certificates (`/certificates`). Routing uses `react-router`.
- **Content is data-driven:** `src/data/profile.js`, `projects.js` and `certificates.js`. Photos, screenshots and certificate scans go in `public/images/{profile,projects,certificates}/`.
- **Source of truth for content:** the CV dated 31 August 2026. Don't invent project details the user hasn't given.
- **Privacy:** don't put the phone number on the site. Public contacts are email, GitHub (`leonid-livshyts`) and the city.
- The site is built to grow to hold as much as possible (photos, screenshots, certificates, links), so the structure stays easy to extend: add an entry to the relevant `src/data/*.js` file and drop its image in `public/images/`.

## Commands

- `npm run dev`: Vite dev server with HMR
- `npm run build`: production build to `dist/`
- `npm run preview`: serve the built `dist/`
- `npm run lint`: ESLint over the whole project
- `npm test`: Vitest (jsdom + Testing Library) single run; `npm run test:watch` for watch mode

## Architecture and tooling notes

- Entry: `index.html` loads `src/main.jsx`, which wraps `<App />` in `BrowserRouter` and `StrictMode` and mounts it into `#root`. Global tokens and shared classes (`.container`, `.button`, `.chips`, `.chip`) live in `src/index.css`; each component/page has its own CSS file next to it, and `src/pages/CardGridPage.css` is shared by the two list pages (Projects, Certificates). `App.jsx` holds the route table under `components/Layout.jsx` (skip link, Header, `<main>`, Footer). Pages set their own `<title>` (React 19 hoists it into `<head>`).
- **React 19 + React Compiler**: `vite.config.js` runs `babel-plugin-react-compiler` through `@rolldown/plugin-babel` (`reactCompilerPreset()`), on top of `@vitejs/plugin-react`. The compiler memoizes automatically, so don't add manual `useMemo`/`useCallback`/`React.memo` unless you've measured a need. Code must follow the Rules of React, or the compiler will skip that component.
- **Vite 8** (Rolldown-based bundler).
- **ESLint 10 flat config** (`eslint.config.js`): `@eslint/js` recommended, `react-hooks` recommended (this includes the compiler-aware rules), and `react-refresh` for Vite. Component files should export only components so HMR keeps working.
- **Tests**: Vitest + Testing Library, co-located as `*.test.jsx`/`*.test.js` next to the code they cover. Setup (jest-dom matchers, explicit `afterEach(cleanup)`) is in `src/test/setup.js`, wired via `vite.config.js`'s `test.setupFiles`. Tests that render routed components (e.g. `Header`, `App`) wrap them in `MemoryRouter`.
- Assets: images live in `public/images/{profile,projects,certificates}/` and are served from the root path unchanged; data files (`src/data/*.js`) reference them by that root path (e.g. `/images/profile/leonid.jpg`).

## Non-app directories

`shared/` (`pipeline.toml`, `orchestrator.toml`) and `.great_cto/` are agent-orchestration config copied in by the great_cto Claude Code plugin at session start. They are not part of the website. Don't import them from app code or ship them.
