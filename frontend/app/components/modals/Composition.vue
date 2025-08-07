<template>
  <TailSheet id="composition" v-model:open="show" @close="show=false">
    <TailSheetContent>
      <TailSheetHeader>
        <TailSheetTitle>
          <h4>
            {{ $t("Composition") }}
          </h4>
        </TailSheetTitle>
      </TailSheetHeader>

      <div class="px-5 my-10">
        <ul>
          <li>75% viscose</li>
          <li>22% polyamide</li>
          <li>3% élasthanne</li>
        </ul>
      </div>
    </TailSheetContent>
  </TailSheet>
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
