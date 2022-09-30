<template>
  <base-modal-vue id="modal-cart" :show="showLanguageModal" :title="$t('Language')" size="sm" centered static-backdrop @close="showLanguageModal = false">
    <div class="container">
      <div class="d-flex justify-content-around">
        <button type="button" class="btn btn-sm btn-light shadow-none" @click="changeLanguage('fr'), showLanguageModal = false">FR</button>
        <button type="button" class="btn btn-sm btn-light shadow-none" @click="changeLanguage('en'), showLanguageModal = false">EN</button>
        <button type="button" class="btn btn-sm btn-light shadow-none" @click="changeLanguage('es'), showLanguageModal = false">Es</button>
      </div>
    </div>
  </base-modal-vue>
</template>

<script>  
import useLanguage from '@/composables/language'
import { useShop } from '@/store/shop'
import { storeToRefs } from 'pinia'

import BaseModalVue from '@/layouts/shop/BaseModal.vue'

export default {
  name: 'ModalLanguage',
  components: {
    BaseModalVue
  },
  setup () {
    const store = useShop()
    const { changeLanguage }  = useLanguage()
    const { showLanguageModal } = storeToRefs(store)
    return {
      showLanguageModal,
      changeLanguage
    }
  },
  computed: {
    countryFlag () {
      var flag = null
      switch (this.$i18n.locale) {
        case 'fr':
          flag = 'fr'
          break
        case 'en':
          flag = 'us'
          break
        default:
          flag = this.$i18n.locale
          break
      }
      return flag
    }
  }
}
</script>
