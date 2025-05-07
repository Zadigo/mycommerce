<template>
  <TailSheet v-model="showModal" @close="showModal=false">
    <TailSheetContent>
      <slot />
    </TailSheetContent>
  </TailSheet>
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
