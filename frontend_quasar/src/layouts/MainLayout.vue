<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Ecommerce website
        </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Home',
    caption: 'quasar.dev',
    icon: 'fas fa-home',
    link: 'home_view'
  },
  {
    title: 'Products',
    caption: 'github.com/quasarframework',
    icon: 'fas fa-table',
    link: 'products_view'
  },
  {
    title: 'Carts',
    caption: 'chat.quasar.dev',
    icon: 'fas fa-shopping-cart',
    link: 'carts_view'
  },
  {
    title: 'Reviews',
    caption: 'forum.quasar.dev',
    icon: 'fas fa-comment',
    link: 'reviews_view'
  },
  {
    title: 'Shipments',
    caption: '@quasarframework',
    icon: 'fas fa-truck',
    link: 'shipments_view'
  },
  {
    title: 'Stocks',
    caption: '@QuasarFramework',
    icon: 'fas fa-box',
    link: 'stocks_view'
  },
  {
    title: 'Subscribers',
    caption: 'Community Quasar projects',
    icon: 'fas fa-users',
    link: 'subscribers_view'
  },
  {
    title: 'Orders',
    caption: 'Community Quasar projects',
    icon: 'fas fa-money-bill',
    link: 'orders_view'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
