<template>
  <BaseNavHeader>
    <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom shadow-none">
      <div class="container">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <NuxtLink to="/cart/" class="nav-link">
              Cart
            </NuxtLink>
          </li>
          <li v-if="!store.isAuthenticated" class="nav-item">
            <a href="#" class="nav-link" @click.prevent="store.showLoginDrawer=true">
              Login
            </a>
          </li>
          <li v-if="store.isAuthenticated" class="nav-item">
            <a href="#" class="nav-link" @click.prevent="proxyLogout">
              Logout
            </a>
          </li>
          <li class="nav-item">
            <NuxtLink to="/account/" class="nav-link">
              Account
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </BaseNavHeader>
</template>

<script lang="ts" setup>
// TODO: Create one unique dictionnary
const accessToken = useCookie('access')
const refereshToken = useCookie('refresh')
const store = useAuthentication()

function proxyLogout () {
  store.logout()
  store.showLoginDrawer = false
  accessToken.value = null
  refereshToken.value = null
}
</script> 
