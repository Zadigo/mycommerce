<template>
  <section id="account">
    <!-- Navbar -->
    <navbar-base />

    <div class="mx-auto px-10">
      <div class="grid grid-cols-12 grid-rows-1 gap-2 my-10">
        <aside class="col-span-3 col-start-3">
          <volt-card class="card border-none">
            <template #content>
              <div class="rounde-md border-gray-50  border-2 rounded-md border-b-2 border-b-gray-50">
                <NuxtLinkLocale id="link-account-aside"  to="/account/" class="p-5 block hover:bg-gray-50">
                  {{ $t("Mon compte") }}
                </NuxtLinkLocale >
  
                <NuxtLinkLocale id="link-orders-aside"  to="/account/orders/" class="p-5 block hover:bg-gray-50">
                  {{ $t("Mes commandes") }}
                </NuxtLinkLocale >
              </div>
            </template>
          </volt-card>
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
const { customHandleError } = useErrorHandler()


/**
 * Profile
 */

const cookieSessionId = useCookie('sessionId')
const fireStore = useFirestore()

const { getProfile, userId } = useUser<Profile>()
const profile = await getProfile('/auth/v1/profile')

if (isDefined(profile)) {
  const userRef = doc(fireStore, 'users', cookieSessionId.value)
  const userSnapshot = await getDoc(userRef)

  if (userSnapshot.exists()) {
    updateDoc(userRef, { profile: profile })
  }
}

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
