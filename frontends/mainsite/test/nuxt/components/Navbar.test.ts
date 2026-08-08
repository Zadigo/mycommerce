import { describe, it, expect, vi, afterEach } from 'vitest'
import Navbar from '../../../app/components/base/Navbar.vue'
import { mountSuspended, renderSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'

const { useNuxtAuthentication } = vi.hoisted(() => ({
  useNuxtAuthentication: vi.fn(() => ({
    user: ref<{ id: number; email: string } | null>({ id: 1, email: 'test@example.com' }),
    isAuthenticated: ref(true),
    login: vi.fn(),
    logout: vi.fn(),
  })),
}))

mockNuxtImport('useUser', () => useNuxtAuthentication)

describe('Navbar', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render correctly', async () => {
    const component = await mountSuspended(Navbar)
    expect(component.exists()).toBe(true)
  })

  it('should have all the required links', async () => {
    const component = await mountSuspended(Navbar)

    const searchButtonEl = component.find('button#action-search')
    expect(searchButtonEl.exists()).toBe(true)
    expect(searchButtonEl.attributes('disabled')).toBeUndefined()
    // expect(searchButtonEl.attributes('aria-label')).toBe('Search')

    const expectedLinnks = ['/', '/cart', '#', '/account']

    component.findAll('a').map((link) => link.attributes('href')).forEach((href) => {
      expect(href).oneOf(expectedLinnks)
    })

    const mobileMenuButtonEl = component.find('button#action-menu')
    expect(mobileMenuButtonEl.exists()).toBe(true)
    expect(mobileMenuButtonEl.attributes('disabled')).toBeUndefined()
  })

  it('should have login button if not authenticated', async () => {
    useNuxtAuthentication.mockImplementationOnce(() => ({
      user: ref(null),
      isAuthenticated: ref(false),
      login: vi.fn(),
      logout: vi.fn(),
    }))

    const component = await renderSuspended(Navbar)
    const loginButtonEl = await component.findByText('Se connecter')
    expect(loginButtonEl).toBeDefined()
  })

  it('should have logout button if authenticated', async () => {  
    const component = await renderSuspended(Navbar)
    const logoutButtonEl = await component.findByText('Se déconnecter')
    const accountButtonEl = await component.findByText('Compte')
    expect(logoutButtonEl).toBeDefined()
    expect(accountButtonEl).toBeDefined()
    // console.log(component.html())
  })
})
