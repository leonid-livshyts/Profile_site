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
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('has a "Skip to content" link to #main on /', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
  })

  it('lists every project on /projects', async () => {
    const { projects } = await import('./data/projects.js')
    renderAt('/projects')
    projects.forEach((p) =>
      expect(screen.getByRole('heading', { level: 2, name: p.title })).toBeInTheDocument(),
    )
  })

  it('lists every certificate on /certificates', async () => {
    const { certificates } = await import('./data/certificates.js')
    renderAt('/certificates')
    certificates.forEach((c) =>
      expect(screen.getByRole('heading', { level: 2, name: c.title })).toBeInTheDocument(),
    )
  })

  it.each(['/', '/projects', '/certificates'])('%s does not show a phone number', (path) => {
    renderAt(path)
    expect(document.body.textContent).not.toMatch(/(\+?\d[\s-]?){9,}/)
  })
})
