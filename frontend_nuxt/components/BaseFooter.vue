<template>
  <footer class="text-center text-lg-start bg-body-tertiary text-muted">
    <section class="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
      <div class="me-5 d-none d-lg-block">
        <span>{{ $t("Get connected with us on social networks") }}:</span>
      </div>

      <div>
        <a v-for="social in socialLinks" :key="social.name" :href="social.href" class="me-4 text-reset">
          <font-awesome :icon="['fab', social.icon]" />
        </a>
      </div>
    </section>

    <section id="main-footer">
      <div class="container text-center text-md-start mt-5">
        <div class="row mt-3">
          <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
            <!-- Content -->
            <h6 class="text-uppercase fw-bold mb-4">
              {{ companyDetails.name }}
            </h6>

            <p>
              {{ companyDetails.description }}
            </p>
          </div>

          <!-- Links -->
          <div v-for="section in footerLinks" :key="section.section" class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold mb-4">
              {{ section.section }}
            </h6>

            <p v-for="link in section.links" :key="link.to" class="mb-1">
              <NuxtLink :to="`/shop/collection/${link.params}`" class="text-reset">
                {{ link.name }}
              </NuxtLink>
            </p>
          </div>

          <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
            <h6 class="text-uppercase fw-bold mb-4">
              {{ $t("Contact") }}
            </h6>
            
            <p class="mb-1">
              <font-awesome icon="home" class="me-2" /> 
              {{ companyDetails.address }}
            </p>

            <p class="mb-1">
              <font-awesome icon="envelope" class="me-2" />
              <a :href="`mailto:${companyDetails.email}`" class="text-muted">
                {{ companyDetails.email }}
              </a>
            </p>
            
            <p class="mb-1">
              <font-awesome icon="phone" class="me-2" />
              {{ companyDetails.telephone }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="d-flex justify-content-between align-items-center p-4" style="background-color: rgba(0, 0, 0, 0.05);">
      <div class="copyright">
        <!-- © {{ $date.year() }} Copyright:  -->
        <NuxtLink to="/" class="text-reset fw-bold">
          {{ companyDetails.name }}
        </NuxtLink>
      </div>
      
      <div class="d-flex justify-content-around gap-4">
        <a href="#" class="text-muted" @click.prevent="store.showLanguageModal = true">
          {{ languageOption?.location }} | {{ languageOption?.language }}
        </a>
        
        <a href="http://" class="text-muted">
          {{ $t("Condition général d'achat") }}
        </a>

        <a href="http://" class="text-muted">
          {{ $t("Politique de confidentialité") }}
        </a>
        
        <a href="http://" class="text-muted">
          {{ $t("Mention légal") }}
        </a>

        <a href="http://" class="text-muted">
          {{ $t("Sitemap") }}
        </a>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { socialLinks, footerLinks, useCompany } from '@/utils'

const store = useShop()
const { companyDetails } = useCompany()
// const languageOption = useStorage<LanguageOptions>('language', { location: null, language: 'fr' }, Storage, { deep: true })
const languageOption = ref({ 
  location: null, 
  language: 'fr'
})


</script>
