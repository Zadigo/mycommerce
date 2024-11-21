import { describe, expect, it } from "vitest";
import { getBaseUrl } from "~/plugins/client";

describe('test get base url', () => {
    it('should resolve to django url', () => {
        const url = getBaseUrl()
        expect(url).toEqual('http://127.0.0.1:8000/api/v1/')
    })
})
