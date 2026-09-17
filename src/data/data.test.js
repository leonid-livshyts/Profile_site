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
