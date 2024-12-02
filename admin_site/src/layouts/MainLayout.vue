<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Ecommerce Admin
        </q-toolbar-title>

        <router-link :to="{ name: 'login' }">
          Login
        </router-link>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>        
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import EssentialLink from 'src/components/EssentialLink.vue'

const leftDrawerOpen = ref(false)
const linksList = [
  {
    title: 'Home',
    icon: 'fas fa-table',
    link: 'home_view'
  },
  {
    title: 'Products',
    icon: 'fas fa-table',
    link: 'products_view'
  }
]

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
