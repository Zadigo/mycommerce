<template>
  <div class="row gx-1 gy-1">
    <div v-for="i in 40" :key="i" class="col-3">
      <v-skeleton-loader type="card"></v-skeleton-loader>
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
