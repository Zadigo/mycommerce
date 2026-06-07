<template>
  <div class="w-full h-full flex flex-col justify-center items-center relative p-10 lg:p-15 text-primary-100 dark:bg-primary-900 dark:text-primary-50">
    <!-- Gradient background -->
    <div class="absolute top-0 left-0 right-0 bottom-0 bg-center bg-no-repeat bg-cover" :style="{ backgroundImage: `url(${image})` }" />

    <div class="relative flex flex-col items-center text-center gap-5 lg:gap-8">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <span class="text-[32px] lg:text-[42px] font-bold tracking-tight uppercase">
          {{ get('legalName') }}
        </span>
      </div>

      <div class="items-center justify-center w-full">
        <!-- Title -->
        <h1 class="text-[48px] lg:text-[80px] font-bold m-0 leading-tight max-w-175 lg:max-w-250" style="display: block; line-clamp: 3; text-overflow: ellipsis; text-wrap: balance;">
          {{ title }}
        </h1>
      </div>

      <!-- Description -->
      <p v-if="description" class="text-[24px] lg:text-[32px] opacity-70 max-w-162.5 lg:max-w-225 leading-relaxed">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  title = 'title',
  description,
  // width = 1200,
  // height = 600,
  image = '/images/hero/customer18-small.webp'
} = defineProps<{
  title?: string
  description?: string
  // width?: number
  // height?: number
  image?: string
}>()

/**
 * Business Details
 */

const { get } = useBusinessDetails()
</script>
