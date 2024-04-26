<template>
  <div class="row gx-1 gy-1">
    <div v-for="i in 40" :key="i" class="col-3">
      <v-skeleton-loader type="card"></v-skeleton-loader>
      <!-- <article class="card shadow-none rounded-0 mb-2" aria-hidden="true">
        <img src="..." class="card-img-top" alt="...">

        <div class="card-body pt-0 px-0 pb-0">
          <p class="card-text placeholder-glow">
            <span class="placeholder col-7"></span>
            <span class="placeholder col-4"></span>
          </p>
        </div>
      </article> -->
    </div>
  </div>
</template>

<script>
import { useUtilities } from 'composables/shop'

export default {
  setup () {
    const { djangoMediaPath } = useUtilities()
    return {
      djangoMediaPath
    }
  }
}
</script>
