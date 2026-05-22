<template>
  <nuxt-card>
    <div v-if="value || forCreation">
      <p class="font-bold">Product name</p>
      <nuxt-input v-model="value.name" class="w-full" label="Product name" />
    </div>
  </nuxt-card>
</template>

<script setup lang="ts">
import type { NewProduct } from '~/types'

const props = defineProps<{ modelValue: NewProduct, forCreation: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [] }>()
const value = useVModel(props, 'modelValue', emit)
</script>
