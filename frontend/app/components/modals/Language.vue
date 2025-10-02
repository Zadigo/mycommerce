<template>
  <tail-sheet id="language-modal" v-model:open="showLanguageModal">
    <tail-sheet-content side="bottom">
      <div class="mx-auto w-2/4">
        <div class="px-3 py-15">
          <div class="col">
            <p class="font-bold mb-4">
              {{ $t('Sélectionnez votre emplacement') }}
            </p>

            <TailSelect v-model="i18nCountry">
              <TailSelectTrigger>
                <TailSelectValue placeholder="Sélectionnez votre pays" />
              </TailSelectTrigger>
              
              <TailSelectContent>
                <TailSelectItem v-for="country in Array.from(countries)" :key="country" :value="country">
                  {{ country }}
                </TailSelectItem>
              </TailSelectContent>
            </TailSelect>
          </div>
          
          <div class="col">
            <p class="font-bold mb-2">
              {{ $t('Sélectionnez votre langue') }}
            </p>

            <div class="flex gap-1 mb-8">
              <tail-button v-for="value in availableLanguages" :key="value" :active="i18n.locale.value === value" @click="selectLanguage(value)">
                {{ value.toUpperCase() }}
              </tail-button>
            </div>
          </div>

          <div class="col">
            <tail-button id="btn-select-language" variant="default" class="rounded-full" @click="saveSelection">
              {{ $t('Enregistrer mon choix') }}
            </tail-button>
          </div>
        </div>
      </div>
    </tail-sheet-content>
  </tail-sheet>
</template>

<script setup lang="ts">
import { doc, updateDoc } from 'firebase/firestore'
import type { countries, DefaultCountries } from '~/types'

type AvailableLanguages = typeof i18n.locale.value

const showLanguageModal = useState<boolean>('showLanguageModal')

const i18n = useI18n()
const localePath = useLocalePath()
const i18nCountry = useCookie<DefaultCountries>('i18nCountry', { sameSite: 'strict', secure: true, default: () => 'France' })

console.info('i18n', i18n.locale.value)

/**
 * Save the user's language and location preferences
 */
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

const db = useFirestore()
const { sessionId } = await useStorageSetup()

watchDebounced([i18n.locale, i18nCountry], async ([languageValue, countryValue]) => {
  if ((isDefined(languageValue) || isDefined(countryValue)) && isDefined(sessionId)) {
    const docRef = doc(db, 'sessions', sessionId.value)
    await updateDoc(docRef, {
      language: {
        choice: languageValue,
        location: countryValue,
        selected: true
      }
    }, {
      merge: true
    })
  }
})
</script>
