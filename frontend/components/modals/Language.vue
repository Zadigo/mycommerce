<template>
  <v-bottom-sheet id="language-modal" v-model="shopStore.showLanguageModal" :persistent="true">
    <v-card>
      <div v-if="shopStore.sessionCache" class="container mx-auto w-2/4">
        <div class="px-3 py-15">
          <div class="col">
            <p class="font-bold mb-4">
              {{ $t('Sélectionnez votre emplacement') }}
            </p>

            <v-autocomplete v-model="shopStore.sessionCache.language.location" :items="countries" variant="solo-filled" flat>
              <v-text-field type="text" />
            </v-autocomplete>
          </div>
          
          <div class="col">
            <p class="font-bold mb-2">
              {{ $t('Sélectionnez votre langue') }}
            </p>

            <div class="d-flex gap-1 mb-8">
              <v-btn v-for="value in availableLanguages" :key="value" :active="shopStore.sessionCache.language.choice === value" variant="outlined" rounded @click="handleLanguageSelection(value)">
                {{ value.toUpperCase() }}
              </v-btn>
            </div>
          </div>

          <div class="col">
            <TailButton id="btn-select-language" variant="default" class="rounded-full" @click="handleSelection">
              {{ $t('Enregistrer mon choix') }}
            </TailButton>
          </div>
        </div>
      </div>

      <TailSkeleton v-else :loading="true" />
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
