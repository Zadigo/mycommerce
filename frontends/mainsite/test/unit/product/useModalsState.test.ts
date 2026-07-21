import { describe, it, expect, vi } from 'vitest'
import type { KeyToRefs } from '~/types'

describe('useModalsState', () => {
  it('should close all modals when closeAllModals is called', () => {
    const result = useModalsState()
    expect(result).toBeDefined()

    expect(result.toggleShowSearchModal).toBeInstanceOf(Function)
    expect(result.toggleShowLanguageModal).toBeInstanceOf(Function)
    expect(result.toggleShowWhatsAppModal).toBeInstanceOf(Function)
    expect(result.toggleShowCartDrawer).toBeInstanceOf(Function)
    expect(result.toggleShowLoginDrawer).toBeInstanceOf(Function)
    expect(result.toggleAuthenticatedCart).toBeInstanceOf(Function)
    expect(result.toggleShowAddedProductDrawer).toBeInstanceOf(Function)
    expect(result.toggleShowEditProductDrawer).toBeInstanceOf(Function)
    expect(result.closeAllModals).toBeInstanceOf(Function)
  })

  it('should close all modals and call the callback when closeAllModals is called', () => {
    const result = useModalsState()
    const callback = vi.fn<(values: KeyToRefs<GlobalStateModalNames, boolean>) => void>()

    result.toggleAuthenticatedCart() // Open the authenticated cart modal
    result.toggleShowSearchModal() // Open the search modal

    result.closeAllModals(callback)

    expect(callback).toHaveBeenCalled()
  })
})
