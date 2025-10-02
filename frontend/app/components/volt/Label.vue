<template>
  <div :class="theme">
    <slot />
    <label :for="for">
      <slot name="label">
        {{ label }}
      </slot>
    </label>
  </div>
</template>

<script setup lang="ts">
defineProps<{ for: string, label?: string }>()

const theme = ref(`
  flex items-center gap-2 text-sm leading-none font-medium select-none 
  group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 
  peer-disabled:cursor-not-allowed peer-disabled:opacity-50
`)
</script>
