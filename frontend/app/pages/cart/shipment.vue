<template>
  <volt-card>
    <template #content>
      <keep-alive>
        <form @submit.prevent>
          <h2 class="font-bold text-2xl mb-5">
            {{ $t("Adresse de livraison") }}
          </h2>

          <volt-input-text v-model="shippingInfo.address_line" class="w-full" placeholder="Addresse" autocomplete="street-address" />
          <volt-input-text v-model="shippingInfo.city" class="w-full my-1" placeholder="Ville" autocomplete="address-level1" />

          <div class="flex justify-between gap-1">
            <volt-input-text v-model="shippingInfo.zip_code" class="w-full" placeholder="Zip code" autocomplete="postal-code" />
            <volt-input-text v-model="shippingInfo.country" autocomplete="country" />
          </div>

          <volt-divider class="my-10" />

          <h2 class="font-bold text-2xl mb-5">
            {{ $t("Mes données") }}
          </h2>

          <div class="flex justify-between gap-1">
            <volt-input-text v-model="shippingInfo.firstname" class="w-full" placeholder="Nom" autocomplete="family-name" />
            <volt-input-text v-model="shippingInfo.lastname" class="w-full" placeholder="Prénom" autocomplete="given-name" />
          </div>

          <div class="flex justify-between gap-2 my-2">
            <volt-input-text v-model="shippingInfo.email" class="w-full" type="email" placeholder="Email" autocomplete="email" />
            <volt-input-text v-model="shippingInfo.telephone" class="w-full" placeholder="Téléphone" autocomplete="tel" />
          </div>

          <volt-label label-for="create-address-set" class="mt-2">
            <volt-toggle-switch id="create-address-set" v-model="saveDetails" />
            <template #label>
              {{ $t('Sauvegarder mes données') }}
            </template> 
          </volt-label>
        </form>
      </keep-alive>
    </template>

    <template #footer>
      <cart-navigation-card-footer next-page="/cart/payment" @navigate:next-page="handleNextPage" />
    </template>
  </volt-card>
</template>

<script lang="ts" setup>
definePageMeta({
  title: 'Cart Shipment',
  layout: 'cart',
  middleware: ['cart']
})

/**
 * Cart
 */

const { cart, cartSession, docRef } = useCartComposable()
const { update } = usePaymentIntentComposable()

/**
 * Analytics
 */

const { addShippingInfo } = useGoogleAnalyticsCallbacks() 

/**
 * New Address form
 */

const { shippingInfo, saveDetails } = useShippingComposable()

/**
 * Navigation
 */

async function handleNextPage() {
  if (isDefined(cartSession) && cartSession.value) {
    await addShippingInfo(cart, cartSession.value.total)
    await update(cartSession.value.total, shippingInfo)
  }
}

/**
 * SEO
 */

useHead({
  title: 'Cart: Shipment',
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})
</script>
