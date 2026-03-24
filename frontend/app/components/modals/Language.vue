<template>
  <volt-drawer id="language-modal" v-model:visible="showLanguageModal" position="bottom" style="height:500px;">
    <div class="mx-auto w-2/4">
      <div class="px-3 py-15">
        <div class="col">
          <p class="font-bold mb-4">
            {{ $t('Sélectionnez votre emplacement') }}
          </p>

          <volt-select v-model="i18nCountry" :options="Array.from(countries)" />
        </div>

        <div class="col">
          <p class="font-bold mb-2">
            {{ $t('Sélectionnez votre langue') }}
          </p>

          <div class="flex gap-1 mb-8">
            <volt-secondary-button v-for="value in availableLanguages" :key="value" :active="i18n.locale.value === value" @click="selectLanguage(value)">
              {{ value.toUpperCase() }}
            </volt-secondary-button>
          </div>
        </div>

        <div class="col">
          <volt-button id="btn-select-language" variant="default" class="rounded-full" @click="saveSelection">
            {{ $t('Enregistrer mon choix') }}
          </volt-button>
        </div>
      </div>
    </div>
  </volt-drawer>
</template>

<script setup lang="ts">
import { doc, setDoc } from 'firebase/firestore'
import type { BaseCountries } from '~/types'

type AvailableLanguages = typeof i18n.locale.value

const showLanguageModal = useState<boolean>('showLanguageModal')

/**
 * TODO: Create a global state composable that will be shared between
 * this modal and the footer component (or other components for global language selection)
 */

const i18n = useI18n()
const localePath = useLocalePath()
const i18nCountry = useCookie<BaseCountries>('i18nCountry', { sameSite: 'strict', secure: true, default: () => 'France' })

console.info('i18n', i18n.locale.value)

// Save the user's language and location preferences
async function saveSelection() {
  showLanguageModal.value = false
  await navigateTo(localePath('/'))
}

const availableLanguages = ref<AvailableLanguages[]>(i18n.availableLocales)

/**
 * Select the user's language preference
 * @param value The selected language
 */
function selectLanguage(value: AvailableLanguages) {
  i18n.locale.value = value
}

/**
 * Firebase update
 */

const { docRef, sessionId } = useSession()

watchDebounced([i18n.locale, i18nCountry], async ([languageValue, countryValue]) => {
  if ((isDefined(languageValue) || isDefined(countryValue)) && isDefined(sessionId) && isDefined(docRef)) {
    i18nCountry.value = countryValue
    
    await setDoc(docRef, {
      language: {
        choice: languageValue,
        selected: true
      }
    }, {
      merge: true
    })
  }
}, { debounce: 500 })
</script>
