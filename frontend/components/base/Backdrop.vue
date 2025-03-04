<template>
  <div v-if="show" id="modalBackdrop" :class="backdropClasses" class="fixed inset-0 bg-black opacity-40 bg-opacity-50 transition-opacity z-40" @click="emit('close')" />
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean
  }
})

const emit = defineEmits({
  close() {
    return true
  }
})

const backdropClasses = computed(() => {
  return [
    {
      'hidden': !show.value,
      'pointer-events-none': !show.value
    }
  ]
})
</script>
