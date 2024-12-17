<template>
  <v-navigation-drawer v-model="proxyShow" width="400" location="right" temporary @close="emit('close')">
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
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
const props = defineProps({
  showModal: {
    type: Boolean
  }
})

const emit = defineEmits({
  close() {
    return true
  }
})

const proxyShow = computed({
  get: () => props.showModal,
  set: () => {
    emit('close')
  }
})
</script>>
