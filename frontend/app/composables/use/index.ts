export * from './session'
export * from './shop'
export * from './product'

/**
 * Composable for managing global modals state
 */
export const [ useGlobalModals, useGlobalModalsStore ] = createInjectionState(() => {
  const [showSearchModal, toggleSearchModal] = useToggle()
  const [showLanguageModal, toggleLanguageModal] = useToggle()
  const [showWhatsAppModal, toggleWhatsAppModal] = useToggle()

  function closeAllModals() {
    showSearchModal.value = false
    showLanguageModal.value = false
    showWhatsAppModal.value = false
  }

  return {
    showSearchModal,
    showLanguageModal,
    showWhatsAppModal,
    toggleSearchModal,
    toggleLanguageModal,
    toggleWhatsAppModal,
    closeAllModals
  }
})
