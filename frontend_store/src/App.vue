<template>
  <v-app>
    <router-view v-slot="{ Component }">
      <transition>
        <component :is="Component" />
      </transition>
    </router-view>
  </v-app>
</template>

<script>
import { useI18n } from "vue-i18n"
import { ref, provide, watch } from 'vue'
import { useAuthentication } from "./stores/authentication"
import { useDocumentVisibility, useMediaQuery, useScreenOrientation } from "@vueuse/core"
import { useSchemaOrg, defineOrganization } from '@unhead/schema-org'

import organization from 'data/organization.json'

export default {
  name: 'App',
  setup () {
    const i18n = useI18n()
    const currentLanguage = ref('fr')

    provide('currentLanguage', currentLanguage)
    
    watch(currentLanguage, (n) => {
      i18n.locale.value = n
    }, {
      immediate: true
    })

    const { value } = useMediaQuery('(min-width: 320px)')
    const { isSupported } = useScreenOrientation()
    const documentVisible = useDocumentVisibility()

    provide('isMobile', value)
    provide('screenOrientation', isSupported)
    provide('documentVisible', documentVisible)

    const authenticationStore = useAuthentication()
    
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
    this.currentLanguage = this.sessionStorage.language || 'fr'
  }
}
</script>

<style>
.opacity-enter-active,
.opacity-leave-active {
  transition: all .10s ease-in-out;
}

.opacity-enter-to,
.opacity-leave-from {
  opacity: .9
}

.opacity-enter-from,
.opacity-leave-to {
  opacity: 1
}
</style>
