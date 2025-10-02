<template>
  <tail-sheet v-model:show="show">
    <tail-sheet-content>
      <slot />
    </tail-sheet-content>
  </tail-sheet>
</template>

<script lang="ts" setup>
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [] }>()

const show = useVModel(props, 'modelValue', emit, {
  defaultValue: false
})
</script>
