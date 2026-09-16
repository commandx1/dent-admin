import { afterEach, describe, expect, it, vi } from 'vitest'
import { toB2bUrl } from './env'

function setB2bUrl(value: string) {
  vi.stubEnv('VITE_B2B_URL', value)
}

describe('toB2bUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    delete window.__ENV__
  })

  it('returns the link unchanged when VITE_B2B_URL is unset', () => {
    setB2bUrl('')
    const link = 'http://qa-92rf.dentypro.com:8095/auth/impersonate?refreshToken=abc'
    expect(toB2bUrl(link)).toBe(link)
  })

  it('replaces protocol and host, preserving path and query', () => {
    setB2bUrl('http://localhost:3001')
    const link = 'http://qa-92rf.dentypro.com:8095/auth/impersonate?refreshToken=abc'
    expect(toB2bUrl(link)).toBe('http://localhost:3001/auth/impersonate?refreshToken=abc')
  })

  it('returns relative/invalid links unchanged', () => {
    setB2bUrl('http://localhost:3001')
    expect(toB2bUrl('/auth/impersonate?refreshToken=abc')).toBe('/auth/impersonate?refreshToken=abc')
  })

  it('ignores a path on the base, using only protocol and host', () => {
    setB2bUrl('http://localhost:3001/')
    const link = 'http://qa-92rf.dentypro.com:8095/auth/impersonate?refreshToken=abc'
    expect(toB2bUrl(link)).toBe('http://localhost:3001/auth/impersonate?refreshToken=abc')
  })
})
