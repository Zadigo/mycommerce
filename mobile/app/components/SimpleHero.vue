<template>
  <div id="slider" ref="sliderEl" class="h-[800px]" @click="() => router.push('/products')" />
</template>

<script setup lang="ts">
import type { Nullable } from '~/types'

const selectedImage = ref('img1.jpg')
const sliderEl = useTemplateRef<Nullable<HTMLElement>>('sliderEl')
const backgroundImg = useCssVar('--background-image', sliderEl)
backgroundImg.value = `url("${selectedImage.value}")`

const router = useRouter()
</script>

<style>
#slider {
  --background-image: url("img1.jpg");
  background-image: var(--background-image);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
