<template>
  <b-modal id="select-language" title="Select language" hide-footer>
    <b-container>
      <v-row>
        <v-col cols="12">
          <v-btn v-for="language in availableLanguages" :key="language" size="lg" class="mx-2" text @click="changeLanguage(language)">
            <country-flag :country="language.toLowerCase()" class="m-0 p-0" />
            {{ language }}
          </v-btn>
        </v-col>
      </v-row>
    </b-container>
  </b-modal>
</template>

<script>
export default {
  name: 'ModalLanguageSelection',

  methods: {
    changeLanguage(language) {
      this.$router.push({ name: 'home', params: { lang: language } })
      this.$bvModal.hide('select-language')
    }
  }
}
</script>
