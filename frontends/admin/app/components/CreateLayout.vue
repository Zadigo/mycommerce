<template>
  <nuxt-container>
    <slot name="pageHeader" />
    
    <div class="grid grid-cols-2 gap-2">
      <slot />
      <slot name="pageAside" />
    </div>
  </nuxt-container>
</template>
