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
