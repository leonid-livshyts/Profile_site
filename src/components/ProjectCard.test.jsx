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
  details: [],
}

describe('ProjectCard', () => {
  it('renders title, summary and tags', () => {
    render(<ProjectCard project={base} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Test project' })).toBeInTheDocument()
    expect(screen.getByText('Does a thing.')).toBeInTheDocument()
    expect(screen.getByText('Web')).toBeInTheDocument()
  })

  it('hides image, links and details when absent', () => {
    render(<ProjectCard project={base} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Details' })).not.toBeInTheDocument()
  })

  it('renders details as a list', () => {
    render(<ProjectCard project={{ ...base, details: ['First point.', 'Second point.'] }} />)
    const list = screen.getByRole('list', { name: 'Details' })
    expect(list.querySelectorAll('li')).toHaveLength(2)
    expect(screen.getByText('Second point.')).toBeInTheDocument()
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
