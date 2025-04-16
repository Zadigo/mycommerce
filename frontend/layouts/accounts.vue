<template>
  <section id="account">
    <!-- Navbar -->
    <NavbarBase />

    <div class="mx-auto px-10">
      <div class="grid grid-cols-12 grid-rows-1 gap-2 my-10">
        <aside class="col-span-3 col-start-3">
          <TailCard class="card border-none">
            <TailCardContent>
              <div class="rounde-md border-gray-50  border-2 rounded-md border-b-2 border-b-gray-50">
                <NuxtLink to="/account/" class="pa-5 block hover:bg-gray-50">
                  {{ $t("Mon compte") }}
                </NuxtLink>

                <NuxtLink to="/account/orders/" class="pa-5 block hover:bg-gray-50">
                  {{ $t("Mes commandes") }}
                </NuxtLink>
              </div>
            </TailCardContent>
          </TailCard>
        </aside>
        
        <div class="col-span-5">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { doc, getDoc, updateDoc } from 'firebase/firestore'

import type { Profile } from '~/types'

const cookieSessionId = useCookie('sessionId')
const authStore = useAuthentication()
const { $client, $fireStore } = useNuxtApp()
const { handleError } = useErrorHandler()
const { profile  } = storeToRefs(authStore)

// const citiesClient = createAxiosSimpleClient('/api/v1/', useRuntimeConfig().public.quartProdUrl, false, 5000)

/**
 * Returns details on the profile for
 * the currently authenticated user 
 */
async function requestUserDetails () {
  try {
    const response = await $client.get<Profile>(`/api/v1/accounts/${authStore.userId}`)
    
    profile.value = response.data

    const userRef = doc($fireStore, 'users', cookieSessionId.value)
    const userSnapshot = await getDoc(userRef)

    if (userSnapshot.exists()) {
      updateDoc(userRef, { profile: response.data })
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
