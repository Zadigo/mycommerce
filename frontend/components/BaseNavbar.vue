<template>
  <nav class="navbar navbar-expand-lg bg-white fixed-top shadow-none" style="z-index: 1000;">
    <div class="container-fluid align-items-center">
      <NuxtLink to="/" class="navbar-brand fw-bold text-uppercase">
        <span class="fs-5">
          E-commerce
        </span>
      </NuxtLink>
      
      <v-btn class="ms-auto" variant="tonal" color="dark" rounded @click="shopStore.showSearchModal=true">
        Rechercher
      </v-btn>

      <ul class="navbar-nav">
        <li class="nav-item">
          <a href="#" class="nav-link" @click.prevent="showCartDrawer=true">
            <font-awesome icon="shopping-bag" class="me-1" />
            {{ $t("Panier") }}
          </a>
        </li>

        <li v-if="!authStore.isAuthenticated" class="nav-item">
          <a href="#" class="nav-link" @click.prevent="authStore.showLoginDrawer=true">
            <font-awesome icon="right-to-bracket" class="me-1" />
            {{ $t('Se connecter') }}
          </a>
        </li>
        
        <li v-else class="nav-item">
          <a href="#" class="nav-link" @click.prevent="proxyLogout">
            <font-awesome icon="right-from-bracket" class="me-1" />
            {{ $t('Se déconnecter') }}
          </a>
        </li>
        
        <li v-show="authStore.isAuthenticated" class="nav-item">
          <NuxtLink to="/account/" class="nav-link">
            <font-awesome icon="user" class="me-1" />
            {{ $t('Compte') }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
  <!-- <BaseNavHeader>
  </BaseNavHeader> -->
</template>

<script lang="ts" setup>
// TODO: Create one unique dictionnary
const accessToken = useCookie('access')
const refereshToken = useCookie('refresh')
const shopStore = useShop()
const authStore = useAuthentication()
const { showCartDrawer } = storeToRefs(useCart())

function proxyLogout () {
  authStore.logout()
  authStore.showLoginDrawer = false
  accessToken.value = null
  refereshToken.value = null
}
</script> 
