<template>
  <v-app>
    <router-view v-slot="{ Component }">
      <transition name="opacity">
        <component :is="Component" />
      </transition>
    </router-view>
  </v-app>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ref, provide, watch } from 'vue'
import { useAuthentication } from 'src/stores/authentication'
import { useDocumentVisibility, useMediaQuery, useScreenOrientation } from '@vueuse/core'
import { useSchemaOrg, defineOrganization } from '@unhead/schema-org'

import organization from 'src/data/organization.json'

export default {
  name: 'App',
  setup () {
    const i18n = useI18n()
    const currentLanguage = ref('fr')
    
    const { value } = useMediaQuery('(min-width: 320px)')
    const { isSupported } = useScreenOrientation()
    const documentVisible = useDocumentVisibility()
    
    const authenticationStore = useAuthentication()
    
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
      authenticationStore
    }
  },
  created () {
    this.authenticationStore.loadFromCache()
  },
  beforeMount () {
    this.currentLanguage = this.sessionStorageData.language || 'fr'
  }
}
</script>

<style>
* {
  scrollbar-width: thin;
  scroll-behavior: smooth;
}
</style>
