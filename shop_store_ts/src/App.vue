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
              <p class="fw-bold">
                {{ $t('Sélectionnez votre emplacement') }}
              </p>

              <v-autocomplete v-model="languageOptions.location" :items="countries" variant="solo-filled" flat>
                <v-text-field type="text" />
              </v-autocomplete>
            </div>
            
            <div class="col-6">
              <p class="fw-bold">
                {{ $t('Sélectionnez votre langue') }}
              </p>

              <div class="d-flex gap-1">
                <v-btn :active="languageOptions.language === 'fr'" variant="outlined" rounded @click="languageOptions.language = 'fr'">
                  FR
                </v-btn>
                
                <v-btn :active="languageOptions.language === 'en'" variant="outlined" rounded @click="languageOptions.language = 'en'">
                  EN
                </v-btn>
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

<script lang="ts">
import { useDocumentVisibility, useMediaQuery, useScreenOrientation } from '@vueuse/core'
import { useAuthentication } from '@/stores/authentication'
import { useShop } from '@/stores/shop'
import { provide, ref, watch, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import countries from '@/data/countries.json'

declare type Languages = 'fr' | 'en'

declare type LanguageOptions = {
  location: string,
  language: Languages
}

export default defineComponent({
  name: 'App',
  setup () {
    const i18n = useI18n()
    const currentLanguage = ref<Languages>('fr')
    
    const { value } = useMediaQuery('(min-width: 320px)')
    const { isSupported } = useScreenOrientation()
    const documentVisible = useDocumentVisibility()
    
    const shopStore = useShop()
    const authenticationStore = useAuthentication()

    const languageModalIsPersistent = ref(false)
    const languageOptions = ref<LanguageOptions>({
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
