<template>
  <div v-if="show" id="modalBackdrop" :class="backdropClasses" class="fixed inset-0 bg-black opacity-40 bg-opacity-50 transition-opacity z-40" @click="emit('close')" />
  <div v-if="show" :class="{ 'translate-y-[50px]': show, '-translate-y-full': !show }" id="wrapper" class="relative h-auto z-50">
    <div class="absolute top-30 z-50 left-0 w-full h-auto p-20 bg-white">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  show: {
    type: Boolean,
    default: true
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
      'hidden': !props.show,
      'pointer-events-none': !props.show
    }
  ]
})
</script>
