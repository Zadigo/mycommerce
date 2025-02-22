<template>
  <v-bottom-sheet id="language-modal" v-model="shopStore.showLanguageModal" :persistent="true">
    <v-card>
      <div v-if="shopStore.sessionCache" class="container p-5">
        <div class="row">
          <div class="col-6">
            <p class="fw-bold">
              {{ $t('Sélectionnez votre emplacement') }}
            </p>

            <v-autocomplete v-model="shopStore.sessionCache.language.location" :items="countries" variant="solo-filled" flat>
              <v-text-field type="text" />
            </v-autocomplete>
          </div>
          
          <div class="col-6">
            <p class="fw-bold">
              {{ $t('Sélectionnez votre langue') }}
            </p>

            <div class="d-flex gap-1">
              <v-btn v-for="value in availableLanguages" :key="value" :active="shopStore.sessionCache.language.choice === value" variant="outlined" rounded @click="handleLanguageSelection(value)">
                {{ value.toUpperCase() }}
              </v-btn>
            </div>
          </div>

          <div class="col-12 d-flex justify-content-end">
            <v-btn id="btn-select-language" variant="tonal" color="primary" rounded @click="handleSelection">
              {{ $t('Enregistrer mon choix') }}
            </v-btn>
          </div>
        </div>
      </div>

      <BaseSkeleton v-else :loading="true" />
    </v-card>
  </v-bottom-sheet>
</template>

<script setup lang="ts">
import { countries } from '~/data/countries'


const i18n = useI18n()
const localePath = useLocalePath()
const shopStore = useShop()

type AvailableLanguages = typeof i18n.locale.value

const availableLanguages = ref<AvailableLanguages[]>(i18n.availableLocales)

async function handleSelection() {
  if (shopStore.sessionCache) {
    shopStore.sessionCache.language.selected = true
    // Set the language once the user has accepted in order
    // to prevent "live" text switch
    i18n.locale.value = shopStore.sessionCache.language.choice
  }

  shopStore.showLanguageModal = false
  await navigateTo(localePath('/'))
}

function handleLanguageSelection(value: AvailableLanguages) {
  if (shopStore.sessionCache) {
    shopStore.sessionCache.language.choice = value
  }
}
</script>
