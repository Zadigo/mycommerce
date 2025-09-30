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
                <NuxtLinkLocale id="link-account-aside"  to="/account/" class="p-5 block hover:bg-gray-50">
                  {{ $t("Mon compte") }}
                </NuxtLinkLocale >

                <NuxtLinkLocale id="link-orders-aside"  to="/account/orders/" class="p-5 block hover:bg-gray-50">
                  {{ $t("Mes commandes") }}
                </NuxtLinkLocale >
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

const { t }  = useI18n()
const authStore = useAuthentication()
const { customHandleError } = useErrorHandler()
const { profile  } = storeToRefs(authStore)


/**
 * Profile
 */

const cookieSessionId = useCookie('sessionId')
const { $client, $fireStore } = useNuxtApp()

async function requestUserDetails () {
  const response = await $client<Profile>(`/api/v1/accounts/${authStore.userId}`, {
    method: 'GET',
    onResponse() {

    },
    onRequestError({ error }) {
      customHandleError(error)
    }
  })

  profile.value = response

  const userRef = doc($fireStore, 'users', cookieSessionId.value)
  const userSnapshot = await getDoc(userRef)

  if (userSnapshot.exists()) {
    updateDoc(userRef, { profile: response })
  }
}

requestUserDetails()

useHead({
  title: t("Mon compte"),
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})

onBeforeMount(async () => {
  // TODO: Get the cities from the Quart backend
  // const result = await citiesClient.get('cities', {
  //   params: {
  //     city: 'brissy'
  //   }
  // })
})
</script>
