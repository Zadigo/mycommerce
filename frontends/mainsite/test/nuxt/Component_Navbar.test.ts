import { describe, it, expect, vi } from 'vitest'
import Navbar from '../../app/components/base/Navbar.vue'
import { mountSuspended, renderSuspended } from '@nuxt/test-utils/runtime'

// vi.mock('nuxt-authentication', async (importOriginal) => {
//   const actual = await importOriginal<typeof import('nuxt-authentication')>()

//   return {
//     ...actual,
//     useUser: vi.fn(() => {
//       return {
//         isAuthenticated: true,
//       }
//     })
//   }
// })

describe('Navbar', () => {
  it('should render correctly', async () => {
    const wrapper = await mountSuspended(Navbar)
    expect(wrapper.exists()).toBe(true)
  })

  it('should have all the required links', async () => {
    const wrapper = await mountSuspended(Navbar)

    const searchButtonEl = wrapper.find('button#action-search')
    expect(searchButtonEl.exists()).toBe(true)
    expect(searchButtonEl.attributes('disabled')).toBeUndefined()
    // expect(searchButtonEl.attributes('aria-label')).toBe('Search')

    const expectedLinnks = ['/', '/cart', '#', '/account']

    wrapper.findAll('a').map((link) => link.attributes('href')).forEach((href) => {
      expect(href).oneOf(expectedLinnks)
    })

    const mobileMenuButtonEl = wrapper.find('button#action-menu')
    expect(mobileMenuButtonEl.exists()).toBe(true)
    expect(mobileMenuButtonEl.attributes('disabled')).toBeUndefined()
  })

  it('should have login button if authenticated', async () => {
    const wrapper = await renderSuspended(Navbar)
    const loginButtonEl = await wrapper.findByText('Se connecter')
    expect(loginButtonEl).toBeDefined()

    console.log(wrapper.html())
  })

  // it('should have logout button if authenticated', async () => {
  //   const mock = await vi.importMock<typeof import('nuxt-authentication')>('nuxt-authentication')
  //   mock.useUser.mockReturnValue({
  //     isAuthenticated: true,
  //   })
    
  //   // .useUser.mockReturnValue({
  //   //   isAuthenticated: true,
  //   // })

  //   // const wrapper = await renderSuspended(Navbar)
  //   // const logoutButtonEl = await wrapper.findByText('Se déconnecter')
  //   // expect(logoutButtonEl).toBeDefined()

  //   // console.log(wrapper.html())
  // })
})
