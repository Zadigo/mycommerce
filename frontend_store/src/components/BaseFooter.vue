<template>
  <!-- Footer -->
  <footer class="text-center text-lg-start bg-body-tertiary text-muted">
    <section class="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
      <div class="me-5 d-none d-lg-block">
        <span>Get connected with us on social networks:</span>
      </div>

      <div>
        <a v-for="social in socials" :key="social.name" :href="social.href" class="me-4 text-reset">
          <font-awesome-icon :icon="['fab', social.icon ]" />
        </a>
      </div>
    </section>

    <section class="">
      <div class="container text-center text-md-start mt-5">
        <div class="row mt-3">
          <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
            <!-- Content -->
            <h6 class="text-uppercase fw-bold mb-4">
              Boutique
            </h6>
            <p>
              Here you can use rows and columns to organize your footer content. Lorem ipsum
              dolor sit amet, consectetur adipisicing elit.
            </p>
          </div>

          <!-- Links -->
          <div v-for="section in footer" :key="section.section" class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold mb-4">
              {{ section.section }}
            </h6>

            <p v-for="link in section.links" :key="link.to" class="mb-1">
              <router-link :to="{ name: link.to, params: { id: link.params } }" class="text-reset">
                {{ link.name }}
              </router-link>
            </p>
          </div>

          <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
            <h6 class="text-uppercase fw-bold mb-4">Contact</h6>
            <p class="mb-1"><font-awesome-icon :icon="['fas', 'home']" class="me-2" /> New York, NY 10012, US</p>
            <p class="mb-1">
              <font-awesome-icon :icon="['fas', 'envelope']" class="me-2" />
              <a href="mailto:info@example.com" class="text-muted">info@example.com</a>
            </p>
            <p class="mb-1"><font-awesome-icon :icon="['fas', 'phone']" class="me-2" /> + 01 234 567 88</p>
          </div>
        </div>
      </div>
    </section>

    <div class="d-flex justify-content-between align-items-center p-4" style="background-color: rgba(0, 0, 0, 0.05);">
      <div class="copyright">© {{ $date.year() }} Copyright: <router-link :to="{ name: 'shop_products' }" class="text-reset fw-bold">Boutique</router-link></div>
      <div class="d-flex justify-content-around gap-4">
        <a href="http://" class="text-muted">Condition général d'achat</a>
        <a href="http://" class="text-muted">Politique de confidentialité</a>
        <a href="http://" class="text-muted">Mention légal</a>
        <a href="http://" class="text-muted">Sitemap</a>
      </div>
    </div>
  </footer>
</template>

<script>
import socials from 'data/socials.json'
import footer from 'data/footer_links.json'

export default {
  name: 'BaseFooter',
  setup () {
    return {
      footer,
      socials
    }
  }
}
</script>
