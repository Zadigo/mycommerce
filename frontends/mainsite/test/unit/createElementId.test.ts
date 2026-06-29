import { describe, it, expect } from 'vitest'
import { createElementId } from '../../app/utils'

describe('Create Element Id', () => {
  it('should create a unique element id', () => {
    const result = createElementId('test', 'part1', 'part2')
    expect(result).to.toBeTypeOf('string')
    expect(result).toBe('test_part1__part2')
  })

  it('should handle undefined parts', () => {
    const result = createElementId('test', undefined, 'part2')
    expect(result).to.toBeTypeOf('string')
    expect(result).toBe('test___part2')
  })

  it('should handle numbers', () => {
    const result = createElementId('test', 123, 'part2')
    expect(result).to.toBeTypeOf('string')
    expect(result).toBe('test_123__part2')
  })
})
