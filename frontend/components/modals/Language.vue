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
              <v-btn v-for="value in languages" :key="value" :active="shopStore.sessionCache.language.choice === value" variant="outlined" rounded @click="(value: string) => { shopStore.sessionCache.language.choice = value }">
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

<script lang="ts" setup>
import countries from '~/data/countries.json'
const i18n = useI18n()
const shopStore = useShop()

const languages = ref<string[]>(i18n.availableLocales)

function handleSelection() {
  if (shopStore.sessionCache) {
    shopStore.sessionCache.language.selected = true
  }
  shopStore.showLanguageModal=false
}
</script>
