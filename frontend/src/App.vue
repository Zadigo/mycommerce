<template>
  <v-app>
    <router-view v-slot="{ Component }">
      <transition name="opacity">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Modals -->
    <teleport to="body">
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
                  <v-btn v-for="value in languages" :key="value" :active="languageOptions.language === value" variant="outlined" rounded @click="languageOptions.language = value">
                    {{ value.toUpperCase() }}
                  </v-btn>
                </div>
              </div>

              <div class="col-12 d-flex justify-content-end">
                <v-btn id="btn-select-language" variant="tonal" color="primary" rounded @click="handleLanguageSelection">
                  {{ $t('Enregistrer mon choix') }}
                </v-btn>
              </div>
            </div>
          </div>
        </v-card>
      </v-bottom-sheet>
    </teleport>
  </v-app>
</template>

<script lang="ts">
import { useAuthentication } from '@/stores/authentication'
import { useShop } from '@/stores/shop'
import { useDocumentVisibility, useMediaQuery, useScreenOrientation } from '@vueuse/core'
import { defineComponent, provide, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { LanguageOptions } from './types/languages'

import countries from '@/data/countries.json'

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

    const languageModalIsPersistent = ref(false)
    const languageOptions = ref<LanguageOptions>({
      location: 'France',
      language: 'fr'
    })
    
    const languages = ref<string[]>(i18n.availableLocales)
    
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
      languages,
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
