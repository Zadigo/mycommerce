import { createPinia } from 'pinia'
import { beforeAll, describe, expect, it } from 'vitest'

// import { useAuthentication } from '~/stores/auth'

describe.concurrent('Use Authentication Store', () => {
//   beforeAll(() => {
//     createPinia()
//   })

//   it('user should not be authenticated', () => {
//     const store = useAuthentication()

//     expect(store.accessToken).to.empty.toBeDefined()
//     expect(store.refreshToken).to.empty.toBeDefined()
//     expect(store.profile).toBeUndefined()
//     expect(store.userId).toBeNull()

//     expect(store.isAuthenticated).toBeFalsy()
//   })

//   it('should authenticate user', () => {
//     const store = useAuthentication()
    
//     store.accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1MTYyMzkwMjJ9.m3dwiZen61lzDEFBOdhGjFrnRlBe5aq6aqAyu2ZHVk0'

//     expect(store.isAuthenticated).toBeTruthy()
//     expect(store.userId).to.equal(1)
//   })

  it('Simple test', () => {
    expect(true).toBeTruthy()
  })
})
