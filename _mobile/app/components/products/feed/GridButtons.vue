<template>
  <div class="flex space-x-2">
    <ion-button fill="outline" size="small" @click="grid = 1">
      <icon name="i-lucide-table" />
    </ion-button>

    <ion-button fill="outline" size="small" @click="grid = 2">
      <icon name="i-lucide-table" />
    </ion-button>

    <ion-button fill="outline" size="small" @click="grid = 3">
      <icon name="i-lucide-table" />
    </ion-button>
  </div>
</template>

<script setup lang="ts">
const grid = useState('grid', () => 3)
</script>
