<template>
  <div class="list-group mt-5 fw-ecommerce-small-1">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DeliveryType'
}
</script>

<style scoped>
.fw-ecommerce-small-1 {
  font-size: 0.9rem;
})
</style>
