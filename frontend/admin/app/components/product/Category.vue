<template>
  <nuxt-card>
    <template #header>
      <h2>
        Categories
      </h2>
    </template>

    <div class="space-y-2">
      <p class="font-semibold text-sm">Category</p>
      <nuxt-input v-model="product.category" class="w-full" label="Category" />
      
      <p class="font-semibold text-sm">Sub category</p>
      <nuxt-input v-model="product.sub_category" class="w-full" label="Sub category" />
    </div>
  </nuxt-card>
</template>

<script setup lang="ts">
import type { NewProduct } from '~/types'

const props = defineProps<{ modelValue: NewProduct }>()
const emit = defineEmits<{ 'update:modelValue': [NewProduct] }>()
const product = useVModel(props, 'modelValue', emit)
</script>
