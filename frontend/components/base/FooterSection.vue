<template>
  <slot v-if="slots.default" />
  <template v-else>
    <div v-if="section" id="footer-section" :aria-label="$t(section.name)">
      <p class="font-semibold mb-3">
        {{ section.name }}
      </p>

      <ul class="font-light">
        <li v-for="link in section.links" :key="$t(link.name)" class="mb-1">
          <NuxtLink :to="link.to">
            {{ $t(link.name) }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </template>
</template>

<script setup lang="ts">
import type { FooterSection } from '~/types';

defineProps({
  section: Object as PropType<FooterSection>
})

const slots = useSlots()
</script>
