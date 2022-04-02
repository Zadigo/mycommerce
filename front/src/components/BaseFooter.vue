<template>
  <footer v-if="!$route.meta.fullPage" class="bg-dark text-light text-lg-start mt-6">

    <div class="container">
      <div class="py-8 text-left">
        
        <!-- Sections -->
        <div class="row">
          <div v-for="(section, x) in items" :key="x" class="col-3">
            <p class="font-weight-bold text-uppercase">{{ $t(section.name) }}</p>

            <template v-for="(link, y) in section.links">
              <b-link v-if="link.name" :key="y" :to="{ name: link.name, params: { lang: $i18n.locale } }" class="d-block py-1 text-muted text-decoration-none">
                {{ $t(link.text) }}
              </b-link>

              <b-link v-else :key="y" :href="link.href" class="d-block py-1 text-muted text-decoration-none">
                {{ $t(link.text) }}
              </b-link>

            </template>
          </div>

          <div class="col-3">
            <h2 class="text-uppercase h4">
              {{ $t('newsletter_title_phrase', { company: myproject.company.legalName }) }}
            </h2>
            <p class="text-muted">
              {{ $t('newsletter_phrase', { company: myproject.company.legalName }) }}
              <!-- Inscrivez-vous pour connaître les dates de sortie de nouveaux produits, les meilleures offres et les actus Lounge. -->
            </p>
            <b-form-input v-model="subscriptionEmail" type="email" :placeholder="$t('Enter your email')"  @keypress.enter="subscribeUser"></b-form-input>
          </div>

          <!-- Language -->
          <!-- <div class="col-2">
            <v-select :items="availableLanguages" dense outlined @change="changeLanguage"></v-select>
          </div> -->
        </div>
      
      </div>
    </div>

    <hr class="m-0" />

    <!-- Socials -->
    <div class="text-center py-4 align-items-center">
      <a href="https://www.youtube.com/channel/UC5CF7mLQZhvx8O5GODZAhdA" class="btn btn-primary m-1" role="button" rel="nofollow" target="_blank">
        <i class="fab fa-youtube"></i>
      </a>
      <a href="https://www.facebook.com/mdbootstrap" class="btn btn-primary m-1" role="button" rel="nofollow" target="_blank">
        <i class="fab fa-facebook-f"></i>
      </a>
      <a href="https://twitter.com/MDBootstrap" class="btn btn-primary m-1" role="button" rel="nofollow" target="_blank">
        <i class="fab fa-twitter"></i>
      </a>
      <a href="https://github.com/mdbootstrap/mdb-ui-kit" class="btn btn-primary m-1" role="button" rel="nofollow" target="_blank">
        <i class="fab fa-github"></i>
      </a>
    </div>

    <!-- Copyright -->
    <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2);">
      <v-btn v-b-modal.select-language text class="mx-4">{{ $i18n.locale }}</v-btn> © {{ myproject.currentYear }} {{ $t('Copyright') }} {{ myproject.company.legalName }}
    </div>

  </footer>
</template>

<script>
import footer from '@/data/footer'

export default {
  name: 'BaseFooter',

  data: () => ({
    items: footer,
    subscriptionEmail: null
  }),

  methods: {
    async subscribeUser() {
      try {
        var response = this.axios.post('/subscribe', { email: this.subscriptionEmail })
        this.subscriptionEmail = null
        response
      } catch(error) {
        this.$store.dispatch('messagesModule/addErrorMessage', error.response.statusText)
      }
    }
  }
}
</script>
