<template>
  <base-modal id="select-language" :title="$t('Select language')" @modal-close="$bModal.close('select-language')">
    <template>
      <div class="container">
        <v-row>
          <v-col cols="12" class="d-flex justify-content-around">
            <v-btn v-for="language in availableLanguages" :key="language" size="lg" class="mx-2" text @click="changeLanguage(language)">
              <country-flag :country="getFlag(language.toLowerCase())" class="m-0 p-0" />
              {{ language }}
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </template>
  </base-modal>
</template>

<script>
import BaseModal from '@/layouts/BaseModal.vue'

export default {
  name: 'ModalLanguageSelection',
  components: {
    BaseModal
  },
  methods: {
    changeLanguage(language) {
      this.$router.push({ name: 'home_view', params: { lang: language } })
      this.$localstorage.create('language', this.$i18n.locale)
      this.$bModal.close('select-language')
    },

    getFlag(language) {
      if (language == 'en') {
        return 'us'
      }
      return language
    }
  }
}
</script>
