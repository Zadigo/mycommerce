<template>
  <v-navigation-drawer v-model="showModal" width="400" location="right" temporary @close="showModal=false">
    <slot />
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
const props = defineProps({
  showModal: {
    type: Boolean
  }
})

const emit = defineEmits({
  modelValue (_data: boolean) {
    return true
  }
})

const showModal= computed({
  get: () => props.showModal,
  set: (value) => emit('modelValue', value)
})
</script>
