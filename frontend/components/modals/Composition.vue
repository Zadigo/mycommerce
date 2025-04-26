<template>
  <Teleport to="body">
    <v-navigation-drawer id="composition" v-model="show" width="400" location="right" temporary @close="show=false">
      <div class="container my-4 fw-light">
        <h4 class="h5 mb-1 mt-3">
          {{ $t("Composition") }}
        </h4>

        <ul>
          <li>75% viscose</li>
          <li>22% polyamide</li>
          <li>3% élasthanne</li>
        </ul>
      </div>
    </v-navigation-drawer>
  </Teleport>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Boolean
  }
})

const emit = defineEmits({
  'update:modelValue'(_value: boolean) {
    return true
  }
})

const show = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value)
  }
})
</script>>
