import { describe, it, expect } from 'vitest'
import { isRef } from 'vue'
import { useBusinessDetails } from '../../layers/base/app/composables/business/base'

describe('useBusinessDetails', () => {
  it('should load the composable without errors', () => {
    const result = useBusinessDetails()
    expect(result.get).toBeDefined()

    expect(result.businessDetails).toBeTypeOf('object')

    expect(result.activeSocials).toBeDefined()
    expect(result.activeSocials.value).toBeTypeOf('object')

    expect(isRef(result.activeSocials)).toBe(true)
    expect(isRef(result.address)).toBe(true)
    expect(isRef(result.geoLocation)).toBe(true)

    const fns: Function[] =  [result.suffixLegalName, result.getSocial, result.getSocialIcon]
    
    fns.forEach((fn) => {
      expect(fn).toBeDefined()
      expect(typeof fn).toBe('function')
    })
  })

  it('should get social', () => {
    const { getSocial } = useBusinessDetails()
    const social = getSocial('instagram')

    expect(social).toBeDefined()
    expect(social).toHaveProperty('url')
    expect(social).toHaveProperty('handle')
  })

  it('should get social icon', () => {
    const { getSocialIcon } = useBusinessDetails()
    const icon = getSocialIcon('instagram')

    expect(icon).toBeDefined()
    expect(icon).toBeTypeOf('string')
    expect(icon).toBe('lucide:instagram')
  })

  it('should suffix legal name correctly', () => {
    const { suffixLegalName } = useBusinessDetails()

    const result = suffixLegalName('My Business')
    expect(result).toBeTypeOf('string')
    expect(result).toContain('My Business')
    expect(result).toContain(' - ')
  })

  it('should return correct address and geoLocation', () => {
    const { address, geoLocation } = useBusinessDetails()
    expect(address.value).toBeTypeOf('string')
    expect(geoLocation.value).toBeTypeOf('string')
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

describe('useBusinessDetails - Failures', () => {
  it('should return null when social does not exist', () => {
    const { getSocial } = useBusinessDetails()
    const social = getSocial('nonexistent' as any)
    expect(social).toBeNull()
  })
})
