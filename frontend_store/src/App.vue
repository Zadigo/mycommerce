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
    this.currentLanguage = this.sessionStorage.language || 'fr'
  }
}
</script>

<style>
.opacity-enter-active,
.opacity-leave-active {
  transition: all .3s ease-in-out;
}

.opacity-enter-to,
.opacity-leave-from {
  opacity: .9;
}

.opacity-enter-from,
.opacity-leave-to {
  opacity: 1;
}

.opacity-move {
  transition: all .2s ease-in-out;
}
</style>
