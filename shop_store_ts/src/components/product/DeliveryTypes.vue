<template>
  <div class="list-group-item d-flex justify-content-start gap-3 align-items-center p-3">
    <font-awesome-icon :icon="['fas', `${iconName}`]" />
    <span>{{ text }}</span>
    <span class="fw-bold text-uppercase text-success">
      {{ $t("Gratuit") }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DeliveryTypes',
  props: {
    text: {
      type: String,
      required: true
    },
    iconName: {
      type: String,
      required: true
    }
  }
})
</script>
