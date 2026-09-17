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
