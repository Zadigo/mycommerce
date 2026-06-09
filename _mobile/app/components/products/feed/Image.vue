<template>
  <p v-if="isLoading">Loading</p>
  <ion-img v-else :src="imageSrc" />
</template>

<script lang="ts" setup>
import { useImage } from '@vueuse/core'
import type { Undefineable } from '~/types'

const props = defineProps<{ imageSrc: Undefineable<string> }>()
const { isLoading } = await useImage({ src: isDefined(props.imageSrc) ? props.imageSrc : '' })
</script>
