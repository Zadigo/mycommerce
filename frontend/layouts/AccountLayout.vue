<template>
  <section style="margin-top: 59px;">
    <!-- Navbar -->
    <BaseNavbar />

    <div class="container">
      <div class="row">
        <div class="col-sm-12 col-md-4 offset-md-2">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="list-group">
                <NuxtLink to="/account/" class="list-group-item p-3">
                  {{ $t("Mon compte") }}
                </NuxtLink>

                <NuxtLink to="/account/orders/" class="list-group-item p-3">
                  {{ $t("Mes commandes") }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-sm-12 col-md-5">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useSessionStorage } from '@vueuse/core';
import createDjangoClient from '~/composables/django_client';
import type { Profile } from '~/types';

const shopStore = useShop()
const authStore = useAuthentication()

const { handleError } = useErrorHandler()

const client = createDjangoClient('/api/v1/')
const citiesClient = createAxiosSimpleClient('/api/v1/', useRuntimeConfig().public.quartProdUrl, false, 5000)

/**
 * Returns details on the profile for
 * the currently authenticated user 
 */
async function requestUserDetails () {
  try {
    const response = await client.get<Profile>(`accounts/${authStore.userId}`)

    if (shopStore.sessionCache) {
      shopStore.sessionCache.profile = response.data
    }
  } catch (e) {
    handleError(e)
  }
}

requestUserDetails()

onBeforeMount(async () => {
  // TODO: Get the cities from the Quart backend
  // const result = await citiesClient.get('cities', {
  //   params: {
  //     city: 'brissy'
  //   }
  // })
})
</script>
