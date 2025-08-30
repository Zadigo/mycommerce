<template>
  <aside id="sidebar" class="w-[var(--sidebar-width)] h-screen border-r bg-gray-100 border-gray-200 p-10 fixed top-0 left-0 shadow-sm">
    <div class="my-20">
      <nuxt-navigation-menu orientation="vertical" :items="items" class="data-[orientation=vertical]:w-48" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Live',
      description: 'Fully styled and customizable components for Nuxt.',
      to: '/dashboard',
      icon: 'i-lucide-chart-area'
    }
  ],
  [
    {
      label: 'Shop',
      icon: 'i-lucide-building',
      defaultOpen: true,
      children: [
        {
          label: 'Products',
          description: 'Fully styled and customizable components for Nuxt.',
          to: '/dashboard/products',
          icon: 'i-lucide-database'
        },
        {
          label: 'Images',
          description: 'Fully styled and customizable components for Nuxt.',
          to: '/dashboard/images',
          icon: 'i-lucide-image'
        },
        {
          label: 'Orders',
          description: 'Fully styled and customizable components for Nuxt.',
          icon: 'i-lucide-shopping-cart'
        }
      ]
    }
  ],
  [
    {
      label: 'Subscribers',
      icon: 'i-lucide-users'
    },
    {
      label: 'Messages',
      icon: 'i-lucide-message-circle-more',
      to: '/'
    }
  ],
  [
    {
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      badge: '3.8k',
      to: 'https://github.com/nuxt/ui',
      target: '_blank'
    },
    {
      label: 'Help',
      icon: 'i-lucide-circle-help',
      disabled: true
    }
  ]
])
</script>
