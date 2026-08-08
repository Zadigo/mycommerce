import { describe, it, expect, vi, afterEach } from 'vitest'
import Navbar from '~/components/base/Navbar.vue'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'

const { useUser, useToggle } = vi.hoisted(() => ({
  useUser: vi.fn(() => ({
    isAuthenticated: ref(true)
  })),
  useToggle: vi.fn()
}))

mockNuxtImport('useUser', () => useUser)

mockNuxtImport('useToggle', () => useToggle)

describe('component > base > navbar', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  const notAuthenticatedLinks = ['/', '/cart', '#', '/account']

  notAuthenticatedLinks.forEach((link) => {
    it(`should have link to ${link}`, async () => {
      const component = await mountSuspended(Navbar)
      const linkEl = component.find(`a[href="${link}"]`)
      expect(linkEl.exists()).toBe(true)
    })
  })

  it('should have search button and mobile menu button', async () => {
    const component = await mountSuspended(Navbar)

    const searchButtonEl = component.find('button#action-search')
    expect(searchButtonEl.exists()).toBe(true)
    expect(searchButtonEl.attributes('disabled')).toBeUndefined()

    const mobileMenuButtonEl = component.find('button#action-menu')
    expect(mobileMenuButtonEl.exists()).toBe(true)
    expect(mobileMenuButtonEl.attributes('disabled')).toBeUndefined()
  })

  it('should not have login button authenticated', async () => {
    useUser.mockReturnValue({
      isAuthenticated: ref(true)
    })
    
    const component = await mountSuspended(Navbar)
    expect(component.find('#action-navbar-signin').exists()).toBe(false)
  })

  it('should have logout button if authenticated', async () => { 
    useUser.mockReturnValueOnce({
      isAuthenticated: ref(true)
    })

    const component = await mountSuspended(Navbar)
    const logoutButtonEl = component.find('Se déconnecter')
    const accountButtonEl = component.find('Compte')

    expect(logoutButtonEl).toBeDefined()
    expect(accountButtonEl).toBeDefined()
  })

  it('should call toggleLoginDrawer when login button is clicked', async () => {
    useUser.mockReturnValueOnce({
      isAuthenticated: ref(false)
    })

    const toggleSpy = vi.fn()
    useToggle.mockReturnValueOnce(toggleSpy)

    const component = await mountSuspended(Navbar)
    const loginButtonEl = component.find('#action-navbar-signin')

    await loginButtonEl.trigger('click')

    expect(toggleSpy).toHaveBeenCalled()
  })
})
