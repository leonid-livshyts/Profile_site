# Profile Site Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Vite template with a yellow/black/white personal profile site for Leonid Livshyts, with a shared header and footer and three pages (About, Projects, Certificates) that get their content from data files seeded from his CV (dated 31 August 2026).

**Architecture:** A client-side React SPA using `react-router` (`BrowserRouter`). A `Layout` route renders `Header`, the current page (`<Outlet />`) and `Footer`. All personal content lives in plain JS modules under `src/data/`, so adding a project, certificate, screenshot or link later means editing data, not JSX. Images (photo, screenshots, certificate scans) live in `public/images/` and data files point to them by root path.

**Tech Stack:** React 19 + React Compiler, Vite 8, react-router 8, Vitest 5 + Testing Library + jsdom, `@fontsource-variable/inter`, plain CSS (one global token file plus one CSS file next to each component).

## Global Constraints

- Plain JavaScript/JSX. No TypeScript.
- Palette is only yellow, black and white: `--yellow: #FFD60A`, `--black: #0A0A0A`, `--white: #FFFFFF`, plus the neutrals `--gray-900: #161616`, `--gray-600: #5C5C5C`, `--gray-200: #E6E6E6`. Never put yellow text on a white background, because the contrast is too low. On light surfaces, yellow is only used as a background or a border, with black text.
- No manual `useMemo`/`useCallback`/`React.memo` (the React Compiler handles memoization).
- Component files export only components (react-refresh rule). Data lives in `src/data/*.js`.
- **Do not publish the phone number** from the CV. Public contact is email, GitHub and city only.
- Display name is `Leonid Livshyts`. Full name `Leonid Livshyts Andrijowych` appears only on the About page.
- Do not invent facts. Project details not in the CV stay out (no made-up tech stacks, dates or links). Missing optional fields are `null` or `[]`, and the UI hides them.
- Layout must work at 360px width with no horizontal scroll.
- Every task ends with `npm run lint`, `npm test` and `npm run build` all passing.
- Never import from `shared/` or `.great_cto/`.

## File Structure

```
index.html                         modify: title, meta description, lang
vite.config.js                     modify: add Vitest `test` block
package.json                       modify: deps + "test" script
public/images/profile/leonid.jpg   add (user supplies the CV photo)
public/images/projects/            screenshots go here later
public/images/certificates/        certificate scans go here later
src/main.jsx                       modify: BrowserRouter + font import
src/index.css                      rewrite: tokens + base styles
src/App.jsx                        rewrite: route table
src/App.test.jsx                   routing smoke tests
src/test/setup.js                  jest-dom matchers + cleanup
src/data/profile.js                identity, contacts, intro, skills, languages
src/data/projects.js               project list
src/data/certificates.js           certificate list
src/data/data.test.js              data shape tests
src/components/Layout.jsx/.css     skip link + Header + <main> + Footer
src/components/Header.jsx/.css     brand + nav
src/components/Footer.jsx/.css     contacts + copyright
src/components/Header.test.jsx
src/components/Footer.test.jsx
src/components/ProjectCard.jsx/.css
src/components/ProjectCard.test.jsx
src/components/CertificateCard.jsx/.css
src/components/CertificateCard.test.jsx
src/pages/AboutPage.jsx/.css
src/pages/AboutPage.test.jsx
src/pages/ProjectsPage.jsx
src/pages/CertificatesPage.jsx
src/pages/CardGridPage.css         shared grid styles for the two list pages
src/pages/NotFoundPage.jsx
DELETE: src/App.css, src/assets/hero.png, src/assets/react.svg, src/assets/vite.svg, public/icons.svg
```

**Prerequisite (user):** save the portrait photo from the CV as `public/images/profile/leonid.jpg` (a portrait crop of about 600×800 is fine). Until it exists the About page shows a broken image, but tests and build still pass.

---

### Task 1: Test tooling, dependencies, template cleanup, design tokens

**Files:**
- Modify: `package.json`, `vite.config.js`, `src/main.jsx`, `index.html`, `CLAUDE.md`
- Rewrite: `src/index.css`, `src/App.jsx`
- Create: `src/test/setup.js`, `src/App.test.jsx`
- Delete: `src/App.css`, `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `public/icons.svg`

**Interfaces:**
- Produces: `npm test` (runs `vitest run`); CSS custom properties `--yellow --black --white --gray-900 --gray-600 --gray-200 --sans --radius --maxw --gutter`; utility class `.container`.

- [ ] **Step 1: Install dependencies**

```bash
npm install react-router @fontsource-variable/inter
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Expected: installs without peer-dependency errors (vitest 5 accepts vite ^8, react-router 8 needs react >=19.2.7).

- [ ] **Step 2: Add the test script and Vitest config**

In `package.json` `"scripts"`, add `"test": "vitest run"` and `"test:watch": "vitest"`.

`vite.config.js`:

```js
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
```

`src/test/setup.js`:

```js
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
```

- [ ] **Step 3: Write the failing smoke test**

`src/App.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App.jsx'

describe('App', () => {
  it('renders the site owner name', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'Leonid Livshyts' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Run it to verify it fails**

Run: `npm test`
Expected: FAIL. The template App has no heading named "Leonid Livshyts".

- [ ] **Step 5: Replace the template App, delete boilerplate, write tokens**

```bash
git rm src/App.css src/assets/hero.png src/assets/react.svg src/assets/vite.svg public/icons.svg
mkdir -p public/images/profile public/images/projects public/images/certificates
touch public/images/projects/.gitkeep public/images/certificates/.gitkeep
```

`src/App.jsx` (temporary; Task 3 replaces it):

```jsx
function App() {
  return <h1>Leonid Livshyts</h1>
}

export default App
```

`src/main.jsx`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

`src/index.css` (full replacement):

```css
:root {
  --yellow: #ffd60a;
  --black: #0a0a0a;
  --white: #ffffff;
  --gray-900: #161616;
  --gray-600: #5c5c5c;
  --gray-200: #e6e6e6;

  --sans: 'Inter Variable', system-ui, 'Segoe UI', Roboto, sans-serif;
  --radius: 12px;
  --maxw: 1100px;
  --gutter: 16px;

  font: 17px/1.6 var(--sans);
  color: var(--black);
  background: var(--white);
  color-scheme: light;
  -webkit-font-smoothing: antialiased;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  background: var(--white);
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

h1,
h2,
h3 {
  line-height: 1.15;
  margin: 0 0 0.5em;
  color: var(--black);
}

h1 {
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 800;
}

h2 {
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  font-weight: 700;
}

h3 {
  font-size: 1.1rem;
  font-weight: 700;
}

p {
  margin: 0 0 1em;
}

a {
  color: inherit;
  text-decoration-color: var(--yellow);
  text-decoration-thickness: 3px;
  text-underline-offset: 3px;
}

a:hover {
  background: var(--yellow);
  color: var(--black);
}

:focus-visible {
  outline: 3px solid var(--yellow);
  outline-offset: 2px;
  box-shadow: 0 0 0 5px var(--black);
}

img {
  max-width: 100%;
  display: block;
}

.container {
  width: 100%;
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0 var(--gutter);
}

@media (min-width: 768px) {
  :root {
    --gutter: 32px;
  }
}
```

`index.html`: set `<html lang="en">`, `<title>Leonid Livshyts</title>`, and add inside `<head>`:

```html
<meta name="description" content="Leonid Livshyts, a student engineer from Kyiv: embedded systems, electronics and web projects." />
<meta name="theme-color" content="#0a0a0a" />
```

`CLAUDE.md`: in the Commands list add `- \`npm test\`: Vitest (jsdom + Testing Library) single run; \`npm run test:watch\` for watch mode`, and delete the line "There is no test runner configured yet…".

- [ ] **Step 6: Verify**

Run: `npm test && npm run lint && npm run build`
Expected: 1 test passes, lint clean, build succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: add vitest, router and fonts; remove vite template boilerplate"
```

---

### Task 2: Content data from the CV

**Files:**
- Create: `src/data/profile.js`, `src/data/projects.js`, `src/data/certificates.js`, `src/data/data.test.js`

**Interfaces:**
- Produces:
  - `profile`: `{ name: string, fullName: string, tagline: string, location: string, email: string, photo: { src: string, alt: string }, links: Array<{ label: string, href: string }>, intro: string[], skillGroups: Array<{ title: string, items: string[] }>, spokenLanguages: Array<{ name: string, level: string }> }`
  - `projects`: `Array<{ id: string, title: string, summary: string, tags: string[], image: null | { src: string, alt: string }, links: Array<{ label: string, href: string }> }>`
  - `certificates`: `Array<{ id: string, title: string, issuer: string, result: string | null, date: string | null, image: null | { src: string, alt: string }, link: string | null }>`

- [ ] **Step 1: Write the failing data tests**

`src/data/data.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { profile } from './profile.js'
import { projects } from './projects.js'
import { certificates } from './certificates.js'

const isImage = (img) =>
  img === null ||
  (typeof img.src === 'string' && img.src.startsWith('/images/') && img.alt.trim().length > 0)

const isLink = (l) => l.label.trim().length > 0 && /^(https:\/\/|mailto:)/.test(l.href)

describe('profile', () => {
  it('has identity and public contacts', () => {
    expect(profile.name).toBe('Leonid Livshyts')
    expect(profile.email).toBe('leonid.livshyts.en@gmail.com')
    expect(profile.location).toBe('Kyiv, Ukraine')
    expect(isImage(profile.photo)).toBe(true)
    expect(profile.links.every(isLink)).toBe(true)
  })

  it('never contains a phone number', () => {
    expect(JSON.stringify(profile)).not.toMatch(/(\+?\d[\s-]?){9,}/)
  })

  it('has non-empty intro, skill groups and languages', () => {
    expect(profile.intro.length).toBeGreaterThan(0)
    expect(profile.skillGroups.length).toBeGreaterThan(0)
    profile.skillGroups.forEach((g) => expect(g.items.length).toBeGreaterThan(0))
    expect(profile.spokenLanguages.map((l) => l.name)).toEqual(['Ukrainian', 'English', 'Polish'])
  })
})

describe('projects', () => {
  it('have unique ids and required text', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    projects.forEach((p) => {
      expect(p.title.trim()).not.toBe('')
      expect(p.summary.trim()).not.toBe('')
      expect(Array.isArray(p.tags)).toBe(true)
      expect(isImage(p.image)).toBe(true)
      expect(p.links.every(isLink)).toBe(true)
    })
  })
})

describe('certificates', () => {
  it('have unique ids and required text', () => {
    const ids = certificates.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    certificates.forEach((c) => {
      expect(c.title.trim()).not.toBe('')
      expect(c.issuer.trim()).not.toBe('')
      expect(isImage(c.image)).toBe(true)
      expect(c.link === null || c.link.startsWith('https://')).toBe(true)
    })
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- src/data`
Expected: FAIL with "Failed to resolve import './profile.js'".

- [ ] **Step 3: Write the data files**

`src/data/profile.js`:

```js
export const profile = {
  name: 'Leonid Livshyts',
  fullName: 'Leonid Livshyts Andrijowych',
  tagline: 'Student engineer building with microcontrollers, electronics and the web.',
  location: 'Kyiv, Ukraine',
  email: 'leonid.livshyts.en@gmail.com',
  photo: {
    src: '/images/profile/leonid.jpg',
    alt: 'Portrait of Leonid Livshyts',
  },
  links: [{ label: 'GitHub', href: 'https://github.com/leonid-livshyts' }],
  intro: [
    'I’m in 11th grade, the final year of school in Ukraine, at Brobots, a private school with an engineering focus. There I have already done practical projects with databases, websites, microcontrollers and electronics.',
    'I write code in Python and MicroPython, C++, HTML and CSS, and build sites with Vite. I have hosted websites through Cloudflare, built Telegram bots, written asynchronous Python programs, and made wooden cases with a large laser cutter.',
  ],
  skillGroups: [
    { title: 'Programming', items: ['Python', 'MicroPython', 'Async Python', 'C++', 'HTML', 'CSS', 'Vite'] },
    { title: 'Databases', items: ['MySQL', 'PostgreSQL'] },
    { title: 'Microcontrollers', items: ['ESP32', 'ESP8266', 'Arduino UNO', 'Arduino Nano', 'RP2040', 'RP2350'] },
    { title: 'Protocols & APIs', items: ['SPI', 'I²C', 'I²S', 'HTTPS', 'Wi-Fi', 'Web APIs', 'Telegram bots'] },
    { title: 'Hosting & fabrication', items: ['Cloudflare hosting', 'Laser cutting'] },
  ],
  spokenLanguages: [
    { name: 'Ukrainian', level: 'Native' },
    { name: 'English', level: 'B2 (IELTS 6.5)' },
    { name: 'Polish', level: 'Basic' },
  ],
}
```

`src/data/projects.js`:

```js
// Screenshots go in public/images/projects/ and are referenced as
// { src: '/images/projects/<file>', alt: '<what the image shows>' }.
export const projects = [
  {
    id: 'robot-sumo',
    title: 'Autonomous robot-sumo car',
    summary: 'A car built for a robot-sumo championship that finds its opponent on its own.',
    tags: ['Robotics', 'Microcontrollers'],
    image: null,
    links: [],
  },
  {
    id: 'circuit-simulator',
    title: 'Circuit diagram simulator',
    summary: 'A simulator for simple circuit diagrams.',
    tags: ['Software', 'Electronics'],
    image: null,
    links: [],
  },
  {
    id: 'mind-map-board',
    title: 'Mind map board',
    summary: 'Designed a mind map board.',
    tags: ['Design'],
    image: null,
    links: [],
  },
  {
    id: 'school-bell',
    title: 'Web-controlled school bell',
    summary: 'A school bell whose melodies teachers can change from a website.',
    tags: ['Microcontrollers', 'Web'],
    image: null,
    links: [],
  },
]
```

`src/data/certificates.js`:

```js
// Scans go in public/images/certificates/.
export const certificates = [
  {
    id: 'ielts',
    title: 'IELTS',
    issuer: 'IELTS',
    result: 'Overall band 6.5 (CEFR B2)',
    date: null,
    image: null,
    link: null,
  },
]
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data
git commit -m "feat: add profile, project and certificate data from CV"
```

---

### Task 3: Layout, Header, Footer and routing

**Files:**
- Create: `src/components/Layout.jsx`, `src/components/Layout.css`, `src/components/Header.jsx`, `src/components/Header.css`, `src/components/Footer.jsx`, `src/components/Footer.css`, `src/components/Header.test.jsx`, `src/components/Footer.test.jsx`, `src/pages/AboutPage.jsx`, `src/pages/ProjectsPage.jsx`, `src/pages/CertificatesPage.jsx`, `src/pages/NotFoundPage.jsx`
- Modify: `src/App.jsx`, `src/App.test.jsx`, `src/main.jsx`

**Interfaces:**
- Consumes: `profile` from `src/data/profile.js` (`name`, `email`, `location`, `links`).
- Produces: default-exported components `Layout`, `Header`, `Footer`, `AboutPage`, `ProjectsPage`, `CertificatesPage`, `NotFoundPage`; routes `/`, `/projects`, `/certificates`, `*`. `App` renders `<Routes>` and expects a router above it (`BrowserRouter` in `main.jsx`, `MemoryRouter` in tests).

- [ ] **Step 1: Write failing tests**

`src/components/Header.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import Header from './Header.jsx'

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Header />
    </MemoryRouter>,
  )

describe('Header', () => {
  it('links the brand to the home page', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Leonid Livshyts' })).toHaveAttribute('href', '/')
  })

  it('shows the three main nav links', () => {
    renderAt('/')
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(nav).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('link', { name: 'Certificates' })).toHaveAttribute('href', '/certificates')
  })

  it('marks only the current page as active', () => {
    renderAt('/projects')
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current')
  })
})
```

`src/components/Footer.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from './Footer.jsx'

describe('Footer', () => {
  it('shows email, GitHub, location and the current year', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'leonid.livshyts.en@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:leonid.livshyts.en@gmail.com',
    )
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/leonid-livshyts',
    )
    expect(screen.getByText('Kyiv, Ukraine')).toBeInTheDocument()
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} Leonid Livshyts`))).toBeInTheDocument()
  })
})
```

`src/App.test.jsx` (replace):

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import App from './App.jsx'

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )

describe('App routing', () => {
  it.each([
    ['/', 'Leonid Livshyts'],
    ['/projects', 'Projects'],
    ['/certificates', 'Certificates'],
    ['/nope', 'Page not found'],
  ])('%s renders the "%s" page heading inside the layout', (path, heading) => {
    renderAt(path)
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test`
Expected: FAIL with unresolved imports `./Header.jsx` / `./Footer.jsx`, and App tests fail.

- [ ] **Step 3: Implement**

`src/components/Header.jsx`:

```jsx
import { Link, NavLink } from 'react-router'
import { profile } from '../data/profile.js'
import './Header.css'

const navItems = [
  { to: '/', label: 'About', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/certificates', label: 'Certificates' },
]

function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand">
          {profile.name}
        </Link>
        <nav aria-label="Main">
          <ul className="site-header__nav">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className="site-header__link">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
```

`src/components/Header.css`:

```css
.site-header {
  background: var(--black);
  color: var(--white);
  border-bottom: 4px solid var(--yellow);
  position: sticky;
  top: 0;
  z-index: 10;
}

.site-header__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 24px;
  padding-block: 14px;
}

.site-header__brand {
  font-weight: 800;
  font-size: 1.15rem;
  text-decoration: none;
  color: var(--yellow);
}

.site-header__brand:hover {
  background: none;
  color: var(--white);
}

.site-header__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.site-header__link {
  display: block;
  padding: 6px 12px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  color: var(--white);
}

.site-header__link:hover {
  background: var(--gray-900);
  color: var(--yellow);
}

.site-header__link[aria-current='page'] {
  background: var(--yellow);
  color: var(--black);
}
```

`src/components/Footer.jsx`:

```jsx
import { profile } from '../data/profile.js'
import './Footer.css'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <ul className="site-footer__contacts">
          <li>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          {profile.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
          <li>{profile.location}</li>
        </ul>
        <p className="site-footer__copy">
          © {year} {profile.name}
        </p>
      </div>
    </footer>
  )
}

export default Footer
```

`src/components/Footer.css`:

```css
.site-footer {
  margin-top: auto;
  background: var(--black);
  color: var(--white);
  border-top: 4px solid var(--yellow);
}

.site-footer__inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px 24px;
  padding-block: 24px;
}

.site-footer__contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-wrap: anywhere;
}

.site-footer__copy {
  margin: 0;
  color: var(--gray-200);
  font-size: 0.9rem;
}
```

`src/components/Layout.jsx`:

```jsx
import { Outlet } from 'react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import './Layout.css'

function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className="site-main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout
```

`src/components/Layout.css`:

```css
.skip-link {
  position: absolute;
  left: 8px;
  top: -100px;
  z-index: 20;
  padding: 8px 12px;
  background: var(--yellow);
  color: var(--black);
  font-weight: 700;
}

.skip-link:focus {
  top: 8px;
}

.site-main {
  flex: 1;
  padding-block: 40px 64px;
}
```

Placeholder pages (Tasks 4–6 replace the first three):

`src/pages/AboutPage.jsx`:

```jsx
import { profile } from '../data/profile.js'

function AboutPage() {
  return (
    <div className="container">
      <h1>{profile.name}</h1>
    </div>
  )
}

export default AboutPage
```

`src/pages/ProjectsPage.jsx`:

```jsx
function ProjectsPage() {
  return (
    <div className="container">
      <h1>Projects</h1>
    </div>
  )
}

export default ProjectsPage
```

`src/pages/CertificatesPage.jsx`:

```jsx
function CertificatesPage() {
  return (
    <div className="container">
      <h1>Certificates</h1>
    </div>
  )
}

export default CertificatesPage
```

`src/pages/NotFoundPage.jsx`:

```jsx
import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <div className="container">
      <title>Page not found · Leonid Livshyts</title>
      <h1>Page not found</h1>
      <p>
        This page doesn’t exist. <Link to="/">Go to the home page</Link>.
      </p>
    </div>
  )
}

export default NotFoundPage
```

`src/App.jsx`:

```jsx
import { Routes, Route } from 'react-router'
import Layout from './components/Layout.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import CertificatesPage from './pages/CertificatesPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<AboutPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
```

`src/main.jsx`: wrap `<App />` in a router:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import '@fontsource-variable/inter'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 4: Verify**

Run: `npm test && npm run lint && npm run build`
Expected: all pass. Then `npm run dev`, open `/`, `/projects`, `/certificates`, `/nope` at 360px and desktop widths. The header nav wraps without horizontal scroll, and the active link is yellow.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add layout with header, footer and page routes"
```

---

### Task 4: About page

**Files:**
- Rewrite: `src/pages/AboutPage.jsx`
- Create: `src/pages/AboutPage.css`, `src/pages/AboutPage.test.jsx`

**Interfaces:**
- Consumes: `profile` (all fields from Task 2).

- [ ] **Step 1: Write the failing test**

`src/pages/AboutPage.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import AboutPage from './AboutPage.jsx'
import { profile } from '../data/profile.js'

describe('AboutPage', () => {
  it('shows name, full name, tagline and photo', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Leonid Livshyts' })).toBeInTheDocument()
    expect(screen.getByText(profile.fullName)).toBeInTheDocument()
    expect(screen.getByText(profile.tagline)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: profile.photo.alt })).toHaveAttribute('src', profile.photo.src)
  })

  it('shows every intro paragraph', () => {
    render(<AboutPage />)
    profile.intro.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument())
  })

  it('shows each skill group with its items', () => {
    render(<AboutPage />)
    profile.skillGroups.forEach((group) => {
      const section = screen.getByRole('group', { name: group.title })
      group.items.forEach((item) => expect(within(section).getByText(item)).toBeInTheDocument())
    })
  })

  it('shows spoken languages with levels', () => {
    render(<AboutPage />)
    expect(screen.getByText('B2 (IELTS 6.5)')).toBeInTheDocument()
    expect(screen.getByText('Native')).toBeInTheDocument()
  })
})
```

(The phone-number check moved to `src/App.test.jsx`, which asserts against a generic phone-shape regex across every route — see Task 7.)

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- src/pages/AboutPage`
Expected: FAIL (placeholder has no full name, photo or skills).

- [ ] **Step 3: Implement**

`src/pages/AboutPage.jsx`:

```jsx
import { profile } from '../data/profile.js'
import './AboutPage.css'

function AboutPage() {
  return (
    <div className="container about">
      <title>{profile.name}</title>

      <section className="about__hero">
        <div className="about__hero-text">
          <p className="about__eyebrow">{profile.location}</p>
          <h1>{profile.name}</h1>
          <p className="about__fullname">{profile.fullName}</p>
          <p className="about__tagline">{profile.tagline}</p>
          <div className="about__actions">
            <a className="button button--primary" href={`mailto:${profile.email}`}>
              Email me
            </a>
            {profile.links.map((link) => (
              <a key={link.href} className="button" href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <img
          className="about__photo"
          src={profile.photo.src}
          alt={profile.photo.alt}
          width="300"
          height="400"
        />
      </section>

      <section className="about__section" aria-labelledby="about-me">
        <h2 id="about-me">About me</h2>
        {profile.intro.map((text) => (
          <p key={text} className="about__intro">
            {text}
          </p>
        ))}
      </section>

      <section className="about__section" aria-labelledby="skills">
        <h2 id="skills">Skills</h2>
        <div className="about__skills">
          {profile.skillGroups.map((group) => {
            const headingId = `skill-${group.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
            return (
            <div key={group.title} role="group" aria-labelledby={headingId} className="about__skill-group">
              <h3 id={headingId}>{group.title}</h3>
              <ul className="chips">
                {group.items.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            )
          })}
        </div>
      </section>

      <section className="about__section" aria-labelledby="languages">
        <h2 id="languages">Languages</h2>
        <dl className="about__languages">
          {profile.spokenLanguages.map((lang) => (
            <div key={lang.name}>
              <dt>{lang.name}</dt>
              <dd>{lang.level}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}

export default AboutPage
```

The heading id is slugified because `aria-labelledby` splits its value on whitespace, so a raw title such as "Protocols & APIs" would not resolve.

Add the shared `.button`, `.chips` and `.chip` styles to the end of `src/index.css`, because Task 5 and Task 6 reuse them:

```css
.button {
  display: inline-block;
  padding: 10px 18px;
  border: 2px solid var(--black);
  border-radius: 999px;
  font-weight: 700;
  text-decoration: none;
  color: var(--black);
  background: var(--white);
}

.button:hover {
  background: var(--black);
  color: var(--yellow);
}

.button--primary {
  background: var(--yellow);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chip {
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--black);
  color: var(--white);
  font-size: 0.85rem;
  font-weight: 600;
}
```

`src/pages/AboutPage.css`:

```css
.about__hero {
  display: grid;
  gap: 32px;
  align-items: center;
  padding: 32px var(--gutter);
  margin-inline: calc(-1 * var(--gutter));
  background: var(--yellow);
}

@media (min-width: 768px) {
  .about__hero {
    grid-template-columns: 1fr auto;
    margin-inline: 0;
    padding: 48px;
    border-radius: var(--radius);
  }
}

.about__eyebrow {
  margin: 0 0 8px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.8rem;
}

.about__fullname {
  margin: -0.25em 0 1em;
  font-weight: 600;
}

.about__tagline {
  font-size: 1.2rem;
  max-width: 36ch;
}

.about__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.about__photo {
  width: min(300px, 100%);
  height: auto;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border: 4px solid var(--black);
  border-radius: var(--radius);
  background: var(--black);
  justify-self: center;
}

.about__section {
  margin-top: 56px;
}

.about__section > h2 {
  display: inline-block;
  border-bottom: 6px solid var(--yellow);
  padding-bottom: 2px;
}

.about__intro {
  max-width: 70ch;
}

.about__skills {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

.about__skill-group {
  padding: 20px;
  border: 2px solid var(--black);
  border-radius: var(--radius);
}

.about__languages {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  margin: 0;
}

.about__languages div {
  padding: 16px 20px;
  border-left: 6px solid var(--yellow);
  background: var(--black);
  color: var(--white);
  border-radius: 4px;
}

.about__languages dt {
  font-weight: 700;
}

.about__languages dd {
  margin: 0;
  color: var(--gray-200);
}
```

- [ ] **Step 4: Verify**

Run: `npm test && npm run lint && npm run build`
Expected: all pass. In `npm run dev` at 360px, the hero stacks with the photo under the text and nothing overflows horizontally.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: build about page with intro, skills and languages"
```

---

### Task 5: Projects page

**Files:**
- Create: `src/components/ProjectCard.jsx`, `src/components/ProjectCard.css`, `src/components/ProjectCard.test.jsx`, `src/pages/CardGridPage.css`
- Rewrite: `src/pages/ProjectsPage.jsx`

**Interfaces:**
- Consumes: `projects` from Task 2; `.chips`/`.chip`/`.button` from Task 4.
- Produces: `ProjectCard({ project })`, where `project` matches the Task 2 project shape; CSS classes `.card-page__lead` and `.card-grid`, which Task 6 reuses.

- [ ] **Step 1: Write the failing test**

`src/components/ProjectCard.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProjectCard from './ProjectCard.jsx'

const base = {
  id: 'x',
  title: 'Test project',
  summary: 'Does a thing.',
  tags: ['Web'],
  image: null,
  links: [],
}

describe('ProjectCard', () => {
  it('renders title, summary and tags', () => {
    render(<ProjectCard project={base} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Test project' })).toBeInTheDocument()
    expect(screen.getByText('Does a thing.')).toBeInTheDocument()
    expect(screen.getByText('Web')).toBeInTheDocument()
  })

  it('hides image and links when absent', () => {
    render(<ProjectCard project={base} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders image and external links when present', () => {
    render(
      <ProjectCard
        project={{
          ...base,
          image: { src: '/images/projects/x.png', alt: 'Screenshot of X' },
          links: [{ label: 'Source', href: 'https://github.com/leonid-livshyts/x' }],
        }}
      />,
    )
    expect(screen.getByRole('img', { name: 'Screenshot of X' })).toHaveAttribute('src', '/images/projects/x.png')
    const link = screen.getByRole('link', { name: 'Source' })
    expect(link).toHaveAttribute('href', 'https://github.com/leonid-livshyts/x')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })
})
```

Add to `src/App.test.jsx` inside the `describe`:

```jsx
  it('lists every project on /projects', async () => {
    const { projects } = await import('./data/projects.js')
    renderAt('/projects')
    projects.forEach((p) =>
      expect(screen.getByRole('heading', { level: 2, name: p.title })).toBeInTheDocument(),
    )
  })
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test`
Expected: FAIL (`ProjectCard.jsx` missing; project headings not rendered).

- [ ] **Step 3: Implement**

`src/components/ProjectCard.jsx`:

```jsx
import './ProjectCard.css'

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      {project.image && (
        <img className="project-card__image" src={project.image.src} alt={project.image.alt} loading="lazy" />
      )}
      <div className="project-card__body">
        <h2 className="project-card__title">{project.title}</h2>
        <p>{project.summary}</p>
        {project.tags.length > 0 && (
          <ul className="chips" aria-label="Tags">
            {project.tags.map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>
        )}
        {project.links.length > 0 && (
          <div className="project-card__links">
            {project.links.map((link) => (
              <a key={link.href} className="button" href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export default ProjectCard
```

`src/components/ProjectCard.css`:

```css
.project-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 2px solid var(--black);
  border-radius: var(--radius);
  background: var(--white);
  box-shadow: 6px 6px 0 var(--yellow);
}

.project-card__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-bottom: 2px solid var(--black);
}

.project-card__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  flex: 1;
}

.project-card__body p {
  margin: 0;
}

.project-card__title {
  font-size: 1.25rem;
  margin: 0;
}

.project-card__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}
```

`src/pages/CardGridPage.css`:

```css
.card-page__lead {
  max-width: 60ch;
  color: var(--gray-600);
  margin-bottom: 32px;
}

.card-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
}
```

`src/pages/ProjectsPage.jsx`:

```jsx
import ProjectCard from '../components/ProjectCard.jsx'
import { projects } from '../data/projects.js'
import './CardGridPage.css'

function ProjectsPage() {
  return (
    <div className="container">
      <title>Projects · Leonid Livshyts</title>
      <h1>Projects</h1>
      <p className="card-page__lead">Things I have built at school and on my own, from robots to websites.</p>
      <ul className="card-grid">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProjectsPage
```

(`.project-card` stretches to the grid row height. If cards in a row end up uneven, add `.card-grid > li { display: flex; } .card-grid > li > * { flex: 1; }` to `CardGridPage.css`.)

- [ ] **Step 4: Verify**

Run: `npm test && npm run lint && npm run build`
Expected: all pass. Check `/projects` at 360px (one column) and desktop (3 columns).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add projects page with data-driven project cards"
```

---

### Task 6: Certificates page

**Files:**
- Create: `src/components/CertificateCard.jsx`, `src/components/CertificateCard.css`, `src/components/CertificateCard.test.jsx`
- Rewrite: `src/pages/CertificatesPage.jsx`

**Interfaces:**
- Consumes: `certificates` from Task 2; `.card-grid`, `.card-page__lead` from Task 5; `.button` from Task 4.
- Produces: `CertificateCard({ certificate })`.

- [ ] **Step 1: Write the failing test**

`src/components/CertificateCard.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CertificateCard from './CertificateCard.jsx'

const base = {
  id: 'c',
  title: 'Test Cert',
  issuer: 'Issuer Org',
  result: null,
  date: null,
  image: null,
  link: null,
}

describe('CertificateCard', () => {
  it('renders title and issuer, hides missing optional fields', () => {
    render(<CertificateCard certificate={base} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Test Cert' })).toBeInTheDocument()
    expect(screen.getByText('Issuer Org')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByText('Result')).not.toBeInTheDocument()
    expect(screen.queryByText('Issued')).not.toBeInTheDocument()
  })

  it('renders result, date, image and verification link when present', () => {
    render(
      <CertificateCard
        certificate={{
          ...base,
          result: 'Band 6.5',
          date: '2026-05',
          image: { src: '/images/certificates/c.jpg', alt: 'Scan of Test Cert' },
          link: 'https://example.org/verify',
        }}
      />,
    )
    expect(screen.getByText('Band 6.5')).toBeInTheDocument()
    expect(screen.getByText('2026-05')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Scan of Test Cert' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Verify Test Cert' })).toHaveAttribute('href', 'https://example.org/verify')
  })
})
```

Add to `src/App.test.jsx` inside the `describe`:

```jsx
  it('lists every certificate on /certificates', async () => {
    const { certificates } = await import('./data/certificates.js')
    renderAt('/certificates')
    certificates.forEach((c) =>
      expect(screen.getByRole('heading', { level: 2, name: c.title })).toBeInTheDocument(),
    )
  })
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test`
Expected: FAIL (`CertificateCard.jsx` missing; IELTS heading not rendered).

- [ ] **Step 3: Implement**

`src/components/CertificateCard.jsx`:

```jsx
import './CertificateCard.css'

function CertificateCard({ certificate }) {
  return (
    <article className="cert-card">
      {certificate.image && (
        <img className="cert-card__image" src={certificate.image.src} alt={certificate.image.alt} loading="lazy" />
      )}
      <div className="cert-card__body">
        <h2 className="cert-card__title">{certificate.title}</h2>
        <dl className="cert-card__meta">
          <div>
            <dt>Issuer</dt>
            <dd>{certificate.issuer}</dd>
          </div>
          {certificate.result && (
            <div>
              <dt>Result</dt>
              <dd>{certificate.result}</dd>
            </div>
          )}
          {certificate.date && (
            <div>
              <dt>Issued</dt>
              <dd>{certificate.date}</dd>
            </div>
          )}
        </dl>
        {certificate.link && (
          <a
            className="button"
            href={certificate.link}
            target="_blank"
            rel="noreferrer"
            aria-label={`Verify ${certificate.title}`}
          >
            Verify
          </a>
        )}
      </div>
    </article>
  )
}

export default CertificateCard
```

`src/components/CertificateCard.css`:

```css
.cert-card {
  height: 100%;
  overflow: hidden;
  border-radius: var(--radius);
  background: var(--black);
  color: var(--white);
  border-top: 8px solid var(--yellow);
}

.cert-card__image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: contain;
  background: var(--white);
}

.cert-card__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
}

.cert-card__title {
  margin: 0;
  color: var(--yellow);
  font-size: 1.3rem;
}

.cert-card__meta {
  display: grid;
  gap: 6px;
  margin: 0;
}

.cert-card__meta div {
  display: flex;
  gap: 8px;
}

.cert-card__meta dt {
  color: var(--gray-200);
  min-width: 4.5em;
}

.cert-card__meta dd {
  margin: 0;
  font-weight: 600;
}

.cert-card .button {
  background: var(--yellow);
  border-color: var(--yellow);
}
```

`src/pages/CertificatesPage.jsx`:

```jsx
import CertificateCard from '../components/CertificateCard.jsx'
import { certificates } from '../data/certificates.js'
import './CardGridPage.css'

function CertificatesPage() {
  return (
    <div className="container">
      <title>Certificates · Leonid Livshyts</title>
      <h1>Certificates</h1>
      <p className="card-page__lead">Exams and courses I have completed.</p>
      <ul className="card-grid">
        {certificates.map((certificate) => (
          <li key={certificate.id}>
            <CertificateCard certificate={certificate} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CertificatesPage
```

- [ ] **Step 4: Verify**

Run: `npm test && npm run lint && npm run build`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add certificates page with IELTS entry"
```

---

### Task 7: Final verification and deploy readiness

**Files:**
- Modify: `README.md` (only if commands changed since the docs update)

- [ ] **Step 1: Full check**

Run: `npm test && npm run lint && npm run build && npm run preview`
Expected: all pass. In the preview at 360px, 768px and 1280px widths:
- all four routes render inside the header and footer
- after a hard refresh on `/projects`, the preview server serves the SPA (Vite preview falls back to `index.html`)
- keyboard Tab shows the skip link first and the yellow/black focus ring on every link
- the browser tab title changes per page
- no phone-number-shaped digit sequence appears anywhere (`grep -rE '[0-9]{3}[ -]?[0-9]{3}[ -]?[0-9]{4}' dist/` returns nothing)

- [ ] **Step 2: Cloudflare Pages note**

Cloudflare Pages already serves `index.html` for unknown paths when the build output has no top-level `404.html`, so deep links work without a `_redirects` file. Do **not** add `/* /index.html 200`, because Pages flags it as an infinite loop. Build command `npm run build`, output directory `dist`.

- [ ] **Step 3: Commit (if anything changed)**

```bash
git add -A
git commit -m "chore: verify profile site foundation"
```

---

## Out of scope for this plan (later iterations)

- Per-project detail pages (`/projects/:id`) with galleries of photos and screenshots
- Filling project details: hardware used, code links, photos (the user needs to supply them)
- More certificates and their scans
- Ukrainian/Polish translations
- Dark mode (the brand palette is deliberately fixed for now)
