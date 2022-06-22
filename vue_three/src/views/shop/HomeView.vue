<template>
  <section id="home">
    <!-- Intro -->
    <base-intro :image="'../assets/hero4.jpg'" style="margin-top:3rem">
      <intro-mask :opacity="0.3">
        <intro-container>
          <div class="text-white">
            <h1 class="mb-3 lead">Assouvis tes ardents désir</h1>
            <h5 class="mb-4 lead-smaller">Craquez pour nos nouveautés signées Lounge</h5>

            <router-link :to="{ name: 'collection_details_view', params: { collection: 'all', lang: $i18n.locale  } }" class="btn btn-dark btn-lg" role="button">
              {{ $t('Discover') }}
            </router-link>
          </div>
        </intro-container>
      </intro-mask>
    </base-intro>
  </section>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>
