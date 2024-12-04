<template>
  <nav class="navbar navbar-expand-lg bg-white fixed-top shadow-none" style="z-index: 1000;">
    <div class="container">
      <NuxtLink to="/" class="navbar-brand fw-bold text-uppercase">
        <span class="fs-5">
          E-commerce
        </span>
      </NuxtLink>

      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a href="#" class="nav-link" @click.prevent="showCartDrawer=true">
            Cart
          </a>
        </li>

        <li v-if="!authStore.isAuthenticated" class="nav-item">
          <a href="#" class="nav-link" @click.prevent="authStore.showLoginDrawer=true">
            {{ $t('Login') }}
          </a>
        </li>
        
        <li v-if="authStore.isAuthenticated" class="nav-item">
          <a href="#" class="nav-link" @click.prevent="proxyLogout">
            {{ $t('Logout') }}
          </a>
        </li>
        
        <li class="nav-item">
          <NuxtLink v-if="authStore.isAuthenticated" to="/account/" class="nav-link">
            {{ $t('Account') }}
          </NuxtLink>
          <a v-else href="#" class="nav-link" @click.prevent="authStore.showLoginDrawer=true">
            {{ $t('Account') }}
          </a>
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
const authStore = useAuthentication()
const { showCartDrawer } = storeToRefs(useCart())

function proxyLogout () {
  authStore.logout()
  authStore.showLoginDrawer = false
  accessToken.value = null
  refereshToken.value = null
}
</script> 
