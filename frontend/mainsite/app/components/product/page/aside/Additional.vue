<template>
  <TailList class="shadow-none border border-gray-100 mt-10">
    <TailListItem class="border-b-2 border-gray-100 flex justify-between items-center text-sm" @click="emit('composition-guide')">
      <div class="flex justify-start gap-2">
        <span>{{ $t('Composition, soin et traçabilité') }}</span>
      </div>
      <Icon name="i-fa7-solid:chevron-right" size="10" />
    </TailListItem>

    <TailListItem class="flex justify-between text-sm" @click="emit('delivery-guide')">
      {{ $t('Livraison et retours') }}
      <Icon name="i-fa7-solid:chevron-right" size="10" />
    </TailListItem>
  </TailList>
</template>

<script lang="ts" setup>
const emit = defineEmits<{ 'composition-guide': [], 'delivery-guide': [] }>()
</script>
