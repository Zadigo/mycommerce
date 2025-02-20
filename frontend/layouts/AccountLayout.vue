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
import type { Profile } from '~/types';

const authenticationStore = useAuthentication()
const sessionProfile = useSessionStorage<Profile>('profile', null, {
  deep: true,
  serializer: {
    write (value) {
      return JSON.stringify(value)
    },
    read (raw) {
      return JSON.parse(raw)
    }
  }
})

const { handleError } = useErrorHandler()

const { client } = useAxiosClient()
const citiesClient = createAxiosSimpleClient('/api/v1/', useRuntimeConfig().public.quartProdUrl, false, 5000)

/**
 * Returns details on the profile for
 * the currently authenticated user 
 */
async function requestUserDetails () {
  try {
    if (!sessionProfile.value) {
      const response = await client.get<Profile>(`accounts/${authenticationStore.userId}`)

      sessionProfile.value = response.data
      authenticationStore.profile = response.data
    } else {
      authenticationStore.profile = sessionProfile.value
    }
  } catch (e) {
    handleError(e)
  }
}

onBeforeMount(async () => {
  await requestUserDetails()

  // TODO: Get the cities from the Quart backend
  // const result = await citiesClient.get('cities', {
  //   params: {
  //     city: 'brissy'
  //   }
  // })
})
</script>
