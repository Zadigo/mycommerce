<template>
  <ModalsBase :show-modal="showModal">
    <div class="container my-4 fw-light">
      <h4 class="h5 mb-1 mt-3">
        {{ $t("Composition") }}
      </h4>

      <ul>
        <li>75% viscose</li>
        <li>22% polyamide</li>
        <li>3% élasthanne</li>
      </ul>
    </div>
  </ModalsBase>
</template>

<script lang="ts" setup>
defineProps({
  showModal: {
    type: Boolean
  }
})
</script>>
