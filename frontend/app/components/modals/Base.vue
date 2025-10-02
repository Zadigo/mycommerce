<template>
  <volt-drawer v-model:visible="show">
    <slot />
  </volt-drawer>
</template>

<script lang="ts" setup>
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [] }>()

const show = useVModel(props, 'modelValue', emit, {
  defaultValue: false
})
</script>
