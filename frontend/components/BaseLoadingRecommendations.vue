<template>
  <div :data-count="quantity" class="recommendations">
    <h2 class="h4 text-center">
      {{ blockTitle }}
    </h2>

    <div ref="productsRow" class="row g-1">
      <div v-for="i in quantity" :key="i" class="col-3">
        <base-skeleton :loading="true" height="329px" />
        <base-skeleton :loading="true" class="my-1" height="22px" width="50%" />
        <base-skeleton :loading="true" height="22px" width="25%" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  blockTitle: {
    type: String,
    default: () => {
      return "Cela peut t'intéresser"
    }
  },
  quantity: {
    type: Number,
    default: 20
  }
})

const scrollable = ref(false)
const productsRow = ref<HTMLElement>()

onMounted(() => {
  if (scrollable.value) {
    if (productsRow.value) {
      productsRow.value.classList.add('products-wrapper')
    }
  }
})
</script>
