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
