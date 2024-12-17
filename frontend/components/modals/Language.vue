<template>
  <v-bottom-sheet id="language-modal" v-model="shopStore.showLanguageModal" :persistent="true">
    <v-card>
      <div class="container p-5">
        <div class="row">
          <div class="col-6">
            <p class="fw-bold">
              {{ $t('Sélectionnez votre emplacement') }}
            </p>

            <v-autocomplete v-model="proxyLanguageOptions.location" :items="countries" variant="solo-filled" flat>
              <v-text-field type="text" />
            </v-autocomplete>
          </div>
          
          <div class="col-6">
            <p class="fw-bold">
              {{ $t('Sélectionnez votre langue') }}
            </p>

            <div class="d-flex gap-1">
              <v-btn v-for="value in languages" :key="value" :active="proxyLanguageOptions.language === value" variant="outlined" rounded @click="proxyLanguageOptions.language = value">
                {{ value.toUpperCase() }}
              </v-btn>
            </div>
          </div>

          <div class="col-12 d-flex justify-content-end">
            <v-btn id="btn-select-language" variant="tonal" color="primary" rounded @click="shopStore.showLanguageModal=false">
              {{ $t('Enregistrer mon choix') }}
            </v-btn>
          </div>
        </div>
      </div>
    </v-card>
  </v-bottom-sheet>
</template>

<script lang="ts" setup>
import { useSessionStorage } from '@vueuse/core';
import countries from '~/data/countries.json'
import type { LanguageOptions } from '~/types'

const i18n = useI18n()
const shopStore = useShop()

const languages = ref<string[]>(i18n.availableLocales)

// FIXME: There's an issue while trying to sync the language options
// with the session/cookie --; see below

const languageOptions = useSessionStorage<LanguageOptions>('language', null, {
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    }
  }
})

const proxyLanguageOptions = computed<LanguageOptions>({
  get: () => languageOptions.value || { location: 'Frane', language: 'fr' },
  set: (value) => {
    languageOptions.value = value
  }
})
</script>
