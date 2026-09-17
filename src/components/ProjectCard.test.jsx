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
