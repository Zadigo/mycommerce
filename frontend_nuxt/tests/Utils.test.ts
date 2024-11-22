import { ref } from 'vue'
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDjangoUtilies, useUtilities,  useListManager } from "../composables/utils";


describe('Use Django Utilities', () => {
    afterEach(() => {
        vi.clearAllTimers()
    })

    it('should return search parameters with a limit and offset', async () => {
        const { builLimitOffset } = useDjangoUtilies()
        const result1 = builLimitOffset('http://example.com?limit=50&offset=50')
        expect(result1).toEqual('limit=50&offset=50')

        const result2 = builLimitOffset('http://example.com')
        expect(result2).toEqual('limit=100&offset=100')
    })

    it('should return the full media path to Django', () => {
        const { mediaPath } = useDjangoUtilies()
        const path = '/avatars/image.png'
        const result = mediaPath(path)
        expect(result).toEqual(`http://${process.env.DJANGO_DEV_URL}/media${path}`)
    })

    it('should return the base url for Django', () => {
        const { getBaseUrl } = useDjangoUtilies()
        expect(getBaseUrl()).toEqual('http://127.0.0.1:8000/')
    })
})

describe('Use Utilities', () => {
    it('should detect null values', async () => {
        const { hasNull } = useUtilities()
        const result = hasNull([1, null])
        expect(result).toBeTruthy()
    })
})

describe('Use List Manager', () => {
    it('should delete or update list', () => {
        const { managedList, save } = useListManager()
        const visitedProducts = ref([1, 2])

        save(visitedProducts, 5)
        expect(managedList.value).toEqual([1, 2, 5])

        
        save(visitedProducts, 5)
        expect(managedList.value).toEqual([1, 2])
    })

    it('should track history correctly', () => {
        const { history, save } = useListManager();
        const visitedProducts = ref([1, 2]);

        // Add item 3 and check history
        save(visitedProducts.value, 3);
        expect(history.value).toEqual([3]);

        // Add item 5 and check history
        save(visitedProducts.value, 5);
        expect(history.value).toEqual([3, 5]);
    });

    it('should return the history of deletions', () => {
        const { deletions, save } = useListManager();
        const visitedProducts = ref([1, 2]);

        // Add items to the list
        save(visitedProducts, 2)
        
        expect(deletions.value).toEqual([2])
    });
})
