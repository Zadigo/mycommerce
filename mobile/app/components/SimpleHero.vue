<template>
  <div v-if="action" :id="id" ref="sliderEl" class="h-[800px]" @click="() => router.push('/products')" />
  <div v-else :id="id" ref="sliderEl" class="h-[800px]" />
</template>

<script setup lang="ts">
import type { Undefineable } from '~/types';

const { id, imageSrc, action = true } = defineProps<{ id: string, imageSrc: Undefineable<string>, action?: boolean }>()

const selectedImage = ref(imageSrc || '')

// const sliderEl = useTemplateRef<Nullable<HTMLElement>>('sliderEl')
// const backgroundImg = useCssVar('--background-image', sliderEl)
// backgroundImg.value = `url("${selectedImage.value}")`

const { css } = useStyleTag(`
  #${id} {
    background-image: url("${selectedImage.value}");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
`)

const router = useRouter()
</script>
