import { createConnection, useIndexedDatabase } from '@/composables/indexdb';
import { afterEach, describe, expect, it, vi } from "vitest";

describe('Indexed Database', () => {
    afterEach(async () => {
        vi.clearAllTimers()
    })

    it('can open a new connection', async () => {
        const conn = await createConnection('test-database')
        expect(conn.name).not.toBeNaN()
        expect(conn.objectStoreNames.contains('storage')).toBeTruthy()
    })
})

describe('Index Database Composable', () => {
    it('can insert and retrieve data from the store', async () => {
        const { get, set } = await useIndexedDatabase()
        await set('firstname', 'Kendall Jenner')
        const value = await get<string>('firstname')
        
        expect(value).toBe('Kendall Jenner')
    })
})
