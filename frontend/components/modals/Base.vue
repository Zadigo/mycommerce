<template>
  <TailSheet v-model:show="show">
    <TailSheetContent>
      <slot />
    </TailSheetContent>
  </TailSheet>
</template>

<script lang="ts" setup>
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [] }>()

const show = useVModel(props, 'modelValue', emit, {
  defaultValue: false
})
</script>
