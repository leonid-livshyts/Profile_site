# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

A personal profile site, currently still the unmodified `create-vite` React template (plain JavaScript/JSX, no TypeScript). The git repo has no commits yet. `src/App.jsx`, `src/App.css`, and the `src/assets/` / `public/icons.svg` files are template boilerplate expected to be replaced.

## Commands

- `npm run dev`: Vite dev server with HMR
- `npm run build`: production build to `dist/`
- `npm run preview`: serve the built `dist/`
- `npm run lint`: ESLint over the whole project

There is no test runner configured yet, so there are no test commands.

## Architecture and tooling notes

- Entry: `index.html` loads `src/main.jsx`, which mounts `<App />` in `StrictMode` into `#root`. Global styles are in `src/index.css`; component styles are in `src/App.css`.
- **React 19 + React Compiler**: `vite.config.js` runs `babel-plugin-react-compiler` through `@rolldown/plugin-babel` (`reactCompilerPreset()`), on top of `@vitejs/plugin-react`. The compiler memoizes automatically, so don't add manual `useMemo`/`useCallback`/`React.memo` unless you've measured a need. Code must follow the Rules of React, or the compiler will skip that component.
- **Vite 8** (Rolldown-based bundler).
- **ESLint 10 flat config** (`eslint.config.js`): `@eslint/js` recommended, `react-hooks` recommended (this includes the compiler-aware rules), and `react-refresh` for Vite. Component files should export only components so HMR keeps working.
- Assets: files imported from `src/assets/` are bundled and hashed. Files in `public/` are served from the root path unchanged (for example `/favicon.svg`, or `/icons.svg#id` sprite references).

## Non-app directories

`shared/` (`pipeline.toml`, `orchestrator.toml`) and `.great_cto/` are agent-orchestration config copied in by the great_cto Claude Code plugin at session start. They are not part of the website. Don't import them from app code or ship them.
