<template>
  <section id="home">
    <base-intro-vue image="/hero4.jpg" height="90vh" offset-top="80px" class="shadow-sm">
      <template #default>
        <div class="text-white">
          <h1 class="mb-3 lead">Assouvis tes ardents désir</h1>
          <h5 class="mb-4 lead-smaller">Craquez pour nos nouveautés signées Lounge</h5>

          <router-link :to="{ name: 'collection_details_view', params: { collection: 'all', lang: $i18n.locale  } }"
            class="btn btn-dark btn-lg" role="button">
            {{ $t('Discover') }}
          </router-link>
        </div>
      </template>
    </base-intro-vue>

    <div class="container my-3">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              Something
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>
