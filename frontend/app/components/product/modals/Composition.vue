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
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const show = useVModel(props, 'modelValue', emit)
</script>
