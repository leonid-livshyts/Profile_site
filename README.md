# Leonid Livshyts: Profile Site

The personal portfolio site of Leonid Livshyts, a student engineer from Kyiv, Ukraine. He builds with microcontrollers (ESP32, RP2040/RP2350, Arduino), electronics and the web.

The site gathers everything about his work in one place: an about page, projects with photos and screenshots, certificates, and links.

## Design

- Palette: **yellow `#FFD60A`, black `#0A0A0A`, white `#FFFFFF`**
- Bold and high-contrast. Black header and footer with yellow accents, and yellow highlights on white content.
- Mobile-first. Works from 360px wide.

## Structure

| Route           | Page         | Content                                                     |
| --------------- | ------------ | ----------------------------------------------------------- |
| `/`             | About        | Photo, intro, skills (grouped), spoken languages           |
| `/projects`     | Projects     | Project cards: title, summary, tags, screenshot, links     |
| `/certificates` | Certificates | Certificate cards: issuer, result, date, scan, verify link |

Every page shares a **header** (name and navigation) and a **footer** (email, GitHub, location).

Content is kept separate from the UI:

```
src/data/profile.js         about me, contacts, skills, languages
src/data/projects.js        projects
src/data/certificates.js    certificates
public/images/profile/      portrait photo
public/images/projects/     project photos and screenshots
public/images/certificates/ certificate scans
```

To add a project or certificate, add an entry to the data file and put its image in `public/images/`.

## Tech stack

- React 19 with React Compiler
- Vite 8
- react-router
- Vitest and Testing Library
- ESLint 10

## Development

```bash
npm install
npm run dev       # dev server
npm test          # run tests
npm run lint      # lint
npm run build     # production build to dist/
npm run preview   # serve the build
```

## Deployment

The site is built for Cloudflare Pages: build command `npm run build`, output directory `dist`.

## Roadmap

The current plan is in [`docs/superpowers/plans/2026-09-16-profile-site-foundation.md`](docs/superpowers/plans/2026-09-16-profile-site-foundation.md).

1. **Foundation (done):** design tokens, header, footer, About, Projects and Certificates pages, seeded from the CV.
2. **Later:** per-project detail pages with galleries, more certificates, Ukrainian/Polish translations.
