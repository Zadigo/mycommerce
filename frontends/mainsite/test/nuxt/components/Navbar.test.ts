import { describe, it, expect, vi } from 'vitest'
import Navbar from '../../../app/components/base/Navbar.vue'
import { mountSuspended, renderSuspended } from '@nuxt/test-utils/runtime'

vi.mock('nuxt-authentication', async (original) => {
  const actual = await original<typeof import('nuxt-authentication')>()

  return {
    ...actual,
    useUser: vi.fn(() => {
      return {
        isAuthenticated: true,
      }
    })
  }
})

describe.only('Navbar', () => {
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
    const component = await renderSuspended(Navbar)
    const loginButtonEl = await component.findByText('Se connecter')
    expect(loginButtonEl).toBeDefined()
  })

  it('should have logout button if authenticated', async () => {  
    const component = await renderSuspended(Navbar)
    const logoutButtonEl = await component.findByText('Compte')
    expect(logoutButtonEl).toBeDefined()
  })
})
