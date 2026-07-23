import { describe, it, expect } from 'vitest'
import { createElementId } from '../../../app/utils'

describe.only('Create Element Id', () => {
  it('should create a unique element id', () => {
    const result = createElementId('cta', 'content', 'test', 'part1', 'part2')
    expect(result).toBeTypeOf('string')
    expect(result).toBe('cta-content-test__part1__part2')
  })

  it('should handle undefined parts', () => {
    const result = createElementId('cta', 'content', 'test', undefined, 'part2')
    expect(result).toBeTypeOf('string')
    expect(result).toBe('cta-content-test__part2')
  })

  it('should handle numbers', () => {
    const result = createElementId('cta', 'header', 'test', 123, 'part2')
    expect(result).toBeTypeOf('string')
    expect(result).toBe('cta-header-test__123__part2')
  })
})
