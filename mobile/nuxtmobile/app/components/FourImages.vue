<template>
  <div class="grid grid-cols-2 gap-2 p-2">
    <div v-for="i in 4" :key="i" class="text-wrapper text-center relative uppercase text-sm" @click="router.push('/products')">
      <ion-img :src="`/images/group1/img${i}.jpg`" />
      <h3 class="font-bold absolute bottom-0 left-0 p-3">Image {{ i }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
