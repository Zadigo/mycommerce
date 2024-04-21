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
import { useMediaQuery, useScreenOrientation } from "@vueuse/core"
import { useSchemaOrg, defineOrganization } from '@unhead/schema-org'

export default {
  name: 'App',
  setup () {
    useSchemaOrg([
      defineOrganization({
        name: 'My Site',
        logo: '/logo.png',
        sameAs: [
          'https://www.facebook.com/my-site',
          'https://twitter.com/my-site',
          'https://www.instagram.com/my-site',
          'https://www.youtube.com/my-site',
        ]
      })
    ])

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

    provide('isMobile', value)
    provide('screenOrientation', isSupported)    
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
