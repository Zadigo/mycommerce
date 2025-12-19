<template>
  <volt-drawer id="composition" v-model:visible="show" position="right">    
    <div class="px-5 my-10">
      <ul>
        <li>75% viscose</li>
        <li>22% polyamide</li>
        <li>3% élasthanne</li>
      </ul>
    </div>
  </volt-drawer>
</template>

<script lang="ts" setup>
const show = defineModel<boolean>('show')
</script>
