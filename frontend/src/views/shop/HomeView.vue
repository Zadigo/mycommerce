<template>
  <section id="home">
    <base-intro-vue :image="require('@/assets/hero4.jpg')" height="90vh" offset-top="80px" class="shadow-sm">
      <template #default>
        <div class="text-white">
          <h1 class="mb-3 lead">Assouvis tes ardents désir</h1>
          <h5 class="mb-4 lead-smaller">Craquez pour nos nouveautés signées Lounge</h5>

          <router-link :to="{ name: 'collection_details_view', params: { collection: 'all', lang: $i18n.locale } }" class="btn btn-dark btn-lg btn-rounded" role="button">
            {{ $t('Discover') }}
          </router-link>
        </div>
      </template>
    </base-intro-vue>

    <!-- TODO: Create a unique component for this -->
    <section id="latest-products">
      <h4 class="fw-bold">Faire ses achats</h4>
      <base-products-ribbon-vue />
    </section>

    <section class="two-images">
      <div class="image">
        <div class="title">
          <h3 class="p-2 text-white text-uppercase fw-bold">-20% sur les sous-vêtements</h3>
          <router-link :to="{ name: 'collection_details_view', params: { collection: 'all', lang: $i18n.locale } }" type="button" class="btn btn-lg btn-rounded btn-dark">
            Le top de nos soldes
          </router-link>
        </div>
      </div>

      <div class="image">
        <div class="title">
          <h3 class="p-2 text-white text-uppercase fw-bold">
            -20% de réduction sur les vêtements
          </h3>
          <router-link :to="{ name: 'collection_details_view', params: { collection: 'all', lang: $i18n.locale } }" type="button" class="btn btn-lg btn-rounded btn-dark">
            Le top de nos soldes
          </router-link>
        </div>
      </div>
    </section>

    <section class="one-image">
      <div class="image">
        <div class="title text-center">
          <h3 class="p-2 text-white text-uppercase fw-bold">-20% sur les sous-vêtements</h3>
          <router-link :to="{ name: 'collection_details_view', params: { collection: 'all', lang: $i18n.locale } }" type="button" class="btn btn-lg btn-rounded btn-dark">
            Le top de nos soldes
          </router-link>
        </div>
      </div>
    </section>

    <section :class="{ 'flex-column flex-column-center': breakpoints.isSmaller('sm'), 'justify-content-around': !breakpoints.isSmaller('sm') }" class="ecommerce-section d-flex">
      <div class="card mx-2">
        <img src="http://via.placeholder.com/600x600" class="card-img-top" alt="">
        <div class="card-body text-center">
          <p>Some item</p>
          <button type="button" class="btn btn-lg btn-dark btn-rounded">Press</button>
        </div>
      </div>

      <div class="card mx-2">
        <img src="http://via.placeholder.com/600x600" class="card-img-top" alt="">
        <div class="card-body text-center">
          <p>Some item</p>
          <button type="button" class="btn btn-lg btn-dark btn-rounded">Press</button>
        </div>
      </div>

      <div class="card mx-2">
        <img src="http://via.placeholder.com/600x600" class="card-img-top" alt="">
        <div class="card-body text-center">
          <p>Some item</p>
          <button type="button" class="btn btn-lg btn-dark btn-rounded">Press</button>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import { useAnalytics } from '../../plugins/vue-analytics/google'
import { useShop } from '../../store/shop'
import { mediaUrl, truncate } from '../../utils'
import BaseProductsRibbonVue from '@/layouts/BaseProductsRibbon.vue'

export default {
  name: 'HomeView',
  components: {
    BaseProductsRibbonVue
  },
  setup () {
    const store = useShop()
    const { google } = useAnalytics()
    const breakpoints = useBreakpoints(breakpointsTailwind)
    return {
      breakpoints,
      google,
      store,
      mediaUrl,
      truncate
    }
  }
}
</script>

<style scoped>
.two-images {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.one-image .image {
  position: relative;
  height: 600px;
  width: auto;
  overflow: hidden;
  background-image: url('../../assets/side1.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}

.two-images .image {
  position: relative;
  height: 500px;
  width: auto;
  overflow: hidden;
  background-image: url('../../assets/side1.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}

.one-image .image .title {
  position: absolute;
  width: 100%;
  padding: 2rem;
  bottom: 10%;
  left: 0;
  z-index: 1;
}

.two-images .image .title {
  position: absolute;
  width: 75%;
  padding: 2rem;
  bottom: 0;
  left: 0;
  z-index: 1;
}

.one-image .image::after,
.two-images .image::after {
  content: "";
  position: absolute;
  display: block;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  width: 100%;
  /* background: linear-gradient(180deg, rgba(0, 0, 0, 0), #fff); */
  background: linear-gradient(180deg, transparent, black);
}

.ecommerce-section {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  height: auto;
  width: 100%;
  overflow: hidden;
}

.scale-enter-active,
.scale-leave-active {
  transition: all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(.95, .95);
}

.scale-enter-to,
.scale-leave-from {
  transform: scale(1, 1);
}
</style>
