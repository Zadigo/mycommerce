<template>
  <!-- Backdrop -->
  <div v-if="show" id="modalBackdrop" :class="backdropClasses" class="fixed inset-0 bg-black opacity-40 bg-opacity-50 transition-opacity z-40" @click="show=false" />

  <!-- Fullscreen -->
  <div v-if="fullscreen" :class="{ 'translate-y-0 opacity-100': show, 'translate-y-3/4 opacity-0': !show }" class="fixed inset-0 z-50 transition-transform duration-300">
    <header class="p-5 bg-gray-100 flex justify-between">
      My header
      <BaseButtonclose @click="show=false" />
    </header>

    <div class="bg-white rounded-none w-full h-full p-6 overflow-y-scroll">
      <slot />
    </div>
  </div>
  
  <!-- Modal -->
  <div v-else id="modal" :class="{ 'scale-100': show, 'scale-0': !show }" class="fixed inset-0 flex items-center justify-center z-50 transform transition-transform duration-300">
    <div role="dialog" class="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">
          Modal title
        </h3>

        <BaseButtonclose @click="show=false" />
      </div>

      <slot />

      <div class="flex justify-end">
        Footer
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  fullscreen: {
    type: Boolean
  }
})

const emit = defineEmits({
  'update:modelValue'(_value: boolean) {
    return true
  }
})

const show = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

watch(show, () => {
  document.body.classList.toggle('no-doc-scroll')
})

const backdropClasses = computed(() => {
  return [
    {
      'hidden': !show.value,
      'pointer-events-none': !show.value
    }
  ]
})

onBeforeMount(() => {
  // By security remove this class attribute if
  // by accident was trailing in the document
  // before mounting the modal
  document.body.classList.remove('no-doc-scroll')
})
</script>

<style lang="scss">
:root:has(.no-doc-scroll) {
  overflow:hidden;
}
</style>
