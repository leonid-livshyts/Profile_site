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
