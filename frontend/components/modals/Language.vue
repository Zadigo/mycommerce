<template>
  <TailSheet id="language-modal" v-model:open="shopStore.showLanguageModal">
    <TailSheetContent side="bottom">
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

            <div class="flex gap-1 mb-8">
              <TailButton v-for="value in availableLanguages" :key="value" :active="shopStore.sessionCache.language.choice === value" @click="handleLanguageSelection(value)">
                {{ value.toUpperCase() }}
              </TailButton>
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
    </TailSheetContent>
  </TailSheet>
</template>

<script setup lang="ts">
import { countries, type DefaultCountries } from '~/data'

type AvailableLanguages = typeof i18n.locale.value

const i18n = useI18n()
const localePath = useLocalePath()
const shopStore = useShop()
const i18nCountry = useCookie<DefaultCountries>('i18nCountry', { sameSite: 'strict', secure: true, default: () => 'France' })

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
