<template>
  <v-bottom-sheet id="language-modal" v-model="shopStore.showLanguageModal" :persistent="true">
    <v-card>
      <div v-if="shopStore.sessionCache" class="container mx-auto w-2/4">
        <div class="px-3 py-15">
          <div class="col">
            <p class="font-bold mb-4">
              {{ $t('Sélectionnez votre emplacement') }}
            </p>

            <v-autocomplete v-model="i18nCountry" :items="countries" variant="solo-filled" flat>
              <v-text-field type="text" />
            </v-autocomplete>
          </div>
          
          <div class="col">
            <p class="font-bold mb-2">
              {{ $t('Sélectionnez votre langue') }}
            </p>

            <div class="d-flex gap-1 mb-8">
              <v-btn v-for="value in availableLanguages" :key="value" :active="shopStore.sessionCache.language.choice === value" variant="outline" rounded @click="handleLanguageSelection(value)">
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

      <TailSkeleton v-else height="100px" />
    </v-card>
  </v-bottom-sheet>
</template>

<script setup lang="ts">
import { countries } from '~/data/countries'

type AvailableLanguages = typeof i18n.locale.value
type AvailableCountries = typeof countries[number]

const i18n = useI18n()
const localePath = useLocalePath()
const shopStore = useShop()
const i18nCountry = useCookie<AvailableCountries>('i18nCountry', { sameSite: 'strict', secure: true, default: () => 'France' })

const availableLanguages = ref<AvailableLanguages[]>(i18n.availableLocales)

console.info('i18n', i18n.locale.value)

/**
 * 
 */
async function handleSelection() {
  if (shopStore.sessionCache) {
    // TODELETE: Technically i18n already stores the language locally
    shopStore.sessionCache.language.selected = true
    // Set the language once the user has accepted in order
    // to prevent "live" text switch
    i18n.locale.value = shopStore.sessionCache.language.choice
    
  }

  shopStore.showLanguageModal = false
  await navigateTo(localePath('/'))
}

/**
 * 
 */
function handleLanguageSelection(value: AvailableLanguages) {
  if (shopStore.sessionCache) {
    shopStore.sessionCache.language.choice = value
  }
}
</script>
