<template>
  <div class="row">
    <div class="col-12">
      <q-card class="q-mb-sm">
        <q-card-section>
          <h1 class="text-h4 q-ma-none">
            <router-link id="home-title" :to="{ name: 'home_view' }" class="text-blue-5 text-weight-bold">
              {{ $t('Home') }}
            </router-link> /
            <span>{{ pageName }}</span>
          </h1>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TablePageComponent',
  props: {
    pageName: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="sass">
#home-title
  text-decoration: none
</style>
