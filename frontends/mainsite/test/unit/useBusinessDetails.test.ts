import { describe, it, expect } from 'vitest'
import { isRef } from 'vue'
import { useBusinessDetails } from '../../layers/base/app/composables/business/base'

describe('Tests for useBusinessDetails', () => {
  it('should load the composable without errors', () => {
    const { get, businessDetails, activeSocials, address, geoLocation } = useBusinessDetails()
    expect(get).toBeDefined()
    
    expect(businessDetails).toBeDefined()
    expect(businessDetails).toBeTypeOf('object')

    expect(activeSocials).toBeDefined()
    expect(isRef(activeSocials)).toBe(true)
    expect(isRef(address)).toBe(true)
    expect(isRef(geoLocation)).toBe(true)
  })

  it('should return correct business details', () => {
    const { get } = useBusinessDetails()
    expect(get('name')).toBeDefined()
    expect(get('legalName')).toBeDefined()
    expect(get('description')).toBeDefined()
    expect(get('address')).toBeDefined()
    expect(get('socials')).toBeTypeOf('object')
    expect(get('founderKnowsAbout')).toBeTypeOf('object')
  })

  it('should return a reactive get when reactiveGet is used', () => {
    const { reactiveGet } = useBusinessDetails()
    expect(reactiveGet).toBeDefined()
    expect(typeof reactiveGet).toBe('function')

    const value = reactiveGet('name')
    expect(isRef(value)).toBe(true)
  })
})
