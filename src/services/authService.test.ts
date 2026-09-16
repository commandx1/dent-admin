import { afterEach, describe, expect, it, vi } from 'vitest'
import api from '@/lib/api'
import { authService } from './authService'
import { useAuthStore } from '@/store/useAuthStore'

vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn(),
  },
}))

function resetStore() {
  useAuthStore.setState({ impersonatingEmail: null })
}

describe('authService.impersonate', () => {
  afterEach(() => {
    resetStore()
    vi.mocked(api.post).mockReset()
  })

  it('rejects a second call while the first is still pending, without hitting api.post again', async () => {
    let resolveFirst: (value: unknown) => void
    vi.mocked(api.post).mockImplementationOnce(
      () => new Promise((resolve) => { resolveFirst = resolve })
    )

    const firstCall = authService.impersonate('vendor-a@example.com')

    await expect(authService.impersonate('vendor-b@example.com')).rejects.toThrow(
      'Another impersonation is already in progress'
    )
    expect(api.post).toHaveBeenCalledTimes(1)

    resolveFirst!({ data: { impersonateLink: 'http://x/auth/impersonate' }, headers: {} })
    await firstCall
  })

  it('resets impersonatingEmail after success, allowing a new call', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { impersonateLink: 'http://x/auth/impersonate' },
      headers: {},
    })

    await authService.impersonate('vendor-a@example.com')
    expect(useAuthStore.getState().impersonatingEmail).toBeNull()

    vi.mocked(api.post).mockResolvedValueOnce({
      data: { impersonateLink: 'http://y/auth/impersonate' },
      headers: {},
    })
    await expect(authService.impersonate('vendor-b@example.com')).resolves.toBeDefined()
    expect(api.post).toHaveBeenCalledTimes(2)
  })

  it('resets impersonatingEmail even when the request rejects', async () => {
    vi.mocked(api.post).mockRejectedValueOnce(new Error('network error'))

    await expect(authService.impersonate('vendor-a@example.com')).rejects.toThrow('network error')
    expect(useAuthStore.getState().impersonatingEmail).toBeNull()
  })
})
