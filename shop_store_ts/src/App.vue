<template>
  Something
</template>

<script lang="ts">
import { defineOrganization, useSchemaOrg } from '@unhead/schema-org'
import { useDocumentVisibility, useMediaQuery, useScreenOrientation } from '@vueuse/core'
import { useAuthentication } from '@/stores/authentication'
import { useShop } from '@/stores/shop'
import { provide, ref, watch, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import countries from '@/data/countries.json'
import organization from '@/data/organization.json'

export default defineComponent({
  name: 'App',
  setup () {
    const i18n = useI18n()
    const currentLanguage = ref('fr')
    
    const { value } = useMediaQuery('(min-width: 320px)')
    const { isSupported } = useScreenOrientation()
    const documentVisible = useDocumentVisibility()
    
    const shopStore = useShop()
    const authenticationStore = useAuthentication()

    const languageModalIsPersistent = ref<boolean>(false)
    const languageOptions = ref({
      location: 'France',
      language: 'fr'
    })
    
    provide('currentLanguage', currentLanguage)
    
    watch(currentLanguage, (n) => {
      i18n.locale.value = n
    }, {
      immediate: true
    })

    provide('isMobile', value)
    provide('screenOrientation', isSupported)
    provide('documentVisible', documentVisible)

    useSchemaOrg([
      defineOrganization(organization)
    ])

    return {
      countries,
      shopStore,
      languageModalIsPersistent,
      languageOptions,
      authenticationStore
    }
  },
  created () {
    this.authenticationStore.loadFromCache()
    this.shopStore.loadFromCache()
  },
  beforeMount () {
    if (!this.$session.keyExists('lang')) {
      this.languageModalIsPersistent = true
      this.shopStore.showLanguageModal = true
    }
  },
  methods: {
    /**
     * Allows the user to select his preferred language
     * and location 
     */
    handleLanguageSelection () {
      this.$session.create('lang', this.languageOptions)
      this.languageModalIsPersistent = false
      this.shopStore.showLanguageModal = false
    }
  }
})
</script>
