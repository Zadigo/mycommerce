<template>
  <footer v-if="!$route.meta.fullPage" class="bg-dark text-light text-lg-start mt-6">
    <div class="container">
      <div class="py-5 text-left">
        <!-- Sections -->
        <div class="row">
          <div v-for="(section, x) in items" :key="x" class="col-sm-12 col-md-3">
            <p class="fw-bold text-uppercase">{{ $t(section.name) }}</p>

            <template v-for="(link, y) in section.links">
              <router-link v-if="link.name" :key="`link-1-${y}`" :to="{ name: link.name, params: { lang: $i18n.locale } }" class="d-block py-1 text-muted text-decoration-none">
                {{ $t(link.text) }}
              </router-link>

              <router-link v-else :key="`link-2-${y}`" :to="link.href" class="d-block py-1 text-muted text-decoration-none">
                {{ $t(link.text) }}
              </router-link>
            </template>
          </div>

          <div class="col-sm-12 col-md-3">
            <h2 class="text-uppercase h4">
              {{ $t('newsletter_title_phrase', { company: myproject.company.legalName }) }}
            </h2>
            <p class="text-muted">
              {{ $t('newsletter_phrase', { company: myproject.company.legalName }) }}
              <!-- Inscrivez-vous pour connaître les dates de sortie de nouveaux produits, les meilleures offres et les actus Lounge. -->
            </p>
            <input v-model="subscriptionEmail" type="email" class="form-control" :placeholder="$t('Enter your email')"  @keypress.enter="subscribeUser" />
          </div>
        </div>
      </div>
    </div>

    <hr class="m-0" />

    <!-- Socials -->
    <div v-if="myproject.company.socials.length > 0" class="text-center py-4 align-items-center">
      <a v-for="social in myproject.company.socials" :key="social.name" :href="social.url" :aria-label="social.name" class="btn btn-transparent shadow-light text-light shadow-none m-1" role="button" rel="nofollow" target="_blank">
        <font-awesome-icon :icon="'fa-brands ' + social.icon" size="2x" />
      </a>
    </div>

    <!-- Copyright -->
    <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2);">
      <!-- <button v-b-modal.select-language text class="mx-4">{{ $i18n.locale }}</button> © {{ myproject.currentYear }} {{ $t('Copyright') }} {{ myproject.company.legalName }} -->
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
    async subscribeUser () {
      try {
        await this.axios.post('/subscribe', { email: this.subscriptionEmail })

        this.subscriptionEmail = null
      } catch (error) {
        this.store.addErrorMessage(error.response.statusText)
      }
    }
  }
}
</script>
