<template>
  <v-app>
    <router-view v-slot="{ Component }">
      <transition name="opacity">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Modals -->
    <v-bottom-sheet id="language-modal" v-model="shopStore.showLanguageModal" :persistent="languageModalIsPersistent">
      <v-card>
        <div class="container p-5">
          <div class="row">
            <div class="col-6">
              <p class="fw-bold">{{ $t('Sélectionnez votre emplacement') }}</p>
              <v-autocomplete v-model="languageOptions.location" :items="countries" variant="solo-filled" flat>
                <v-text-field type="text"></v-text-field>
              </v-autocomplete>
            </div>
            
            <div class="col-6">
              <p class="fw-bold">{{ $t('Sélectionnez votre langue') }}</p>

              <div class="d-flex gap-1">
                <v-btn :active="languageOptions.language === 'fr'" variant="outlined" rounded @click="languageOptions.language = 'fr'">FR</v-btn>
                <v-btn :active="languageOptions.language === 'en'" variant="outlined" rounded @click="languageOptions.language = 'en'">EN</v-btn>
              </div>
            </div>

            <div class="col-12 d-flex justify-content-end">
              <v-btn variant="tonal" color="primary" rounded @click="handleLanguageSelection">
                {{ $t('Enregistrer mon choix') }}
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </v-bottom-sheet>
  </v-app>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ref, provide, watch } from 'vue'
import { useShop } from 'src/stores/shop' 
import { useAuthentication } from 'src/stores/authentication'
import { useDocumentVisibility, useMediaQuery, useScreenOrientation } from '@vueuse/core'
import { useSchemaOrg, defineOrganization } from '@unhead/schema-org'

import organization from 'src/data/organization.json'
import countries from 'src/data/countries.json'

export default {
  name: 'App',
  setup () {
    const i18n = useI18n()
    const currentLanguage = ref('fr')
    
    const { value } = useMediaQuery('(min-width: 320px)')
    const { isSupported } = useScreenOrientation()
    const documentVisible = useDocumentVisibility()
    
    const shopStore = useShop()
    const authenticationStore = useAuthentication()

    const languageModalIsPersistent = ref(false)
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
}
</script>

<style>
* {
  scrollbar-width: thin;
  scroll-behavior: smooth;
}
</style>
