import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthentication } from '~/stores/useAuthentication'

afterEach(() => {
    vi.clearAllTimers()
})

describe('Authentication Store', () => {
    beforeEach(async () => {
        setActivePinia(createPinia())
    })
    
    it('user should be authenticated', async () => {
        const store = useAuthentication()

        store.accessToken = 'access token'
        store.refreshToken = 'refresh token'
        expect(store.isAuthenticated).toBeTruthy()

        store.logout()
        expect(store.accessToken).toBeNull()
        expect(store.isAuthenticated).toBeFalsy()
    })
})
