<template>
  <section id="payment">
    <header class="py-5">
      <nav class="flex justify-center uppercase pa-5">
        <nuxt-link-locale id="link-home-cart-navbar" to="/">
          <h1 class="font-2xl font-bold">
            {{ $t('Boutique') }}
          </h1>
        </nuxt-link-locale>
      </nav>
    </header>

    <div class="container mx-auto px-10">
      <div v-if="isSuccessPage" class="my-5">
        <slot />
      </div>

      <div v-else class="my-5 grid grid-cols-12 gap-4">
        <div class="col-span-12">
          <volt-card class="shadow-none border-none">
            <volt-breadcrumb :model="paymentLinks">
              <template #item="{ item }">
                <nuxt-link-locale v-if="!item.disabled" :to="item.href" class="text-gray-500 hover:text-gray-700">
                  {{ $t(item.label) }}
                </nuxt-link-locale>
                <span v-else class="text-gray-300">
                  {{ $t(item.label) }}
                </span>
              </template>
            </volt-breadcrumb>
          </volt-card>
        </div>

        <div class="col-span-6">
          <slot />
        </div>


        <div class="col-span-6">
          <volt-card class="border-none bg-gray-50">
            <template #title>
              {{ $t('Résumé', { n: numberOfProducts }) }}
            </template>
            
            <template #content>
              <CartIterator :is-editable="false" />
            </template>

            <template #footer>
              <div class="flex flex-col w-full">
                <div class="price flex justify-between w-full">
                  <div class="w-full">{{ $t('Sous-total') }}</div>
                  <div class="font-bold">{{ $n(cartTotal, 'currency') }}</div>
                </div>

                <div class="delivery flex justify-between my-2 w-full">
                  <span>{{ $t("Frais d'envoi") }}</span>

                  <div class="font-bold uppercase text-green-500">
                    {{ $t('Gratuit') }}
                  </div>
                </div>

                <div class="total flex justify-between w-full">
                  <div class="p-5">{{ $t('Total (TVA comprise)') }}</div>
                  <div class="font-bold">{{ $n(cartTotal, 'currency') }}</div>
                </div>
              </div>
            </template>
          </volt-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const cartStore = useCart()
const route = useRoute()

// Checks if the user has reached the success page
const isSuccessPage = computed(() => {
  return route.path === '/cart/success'
})

const paymentLinks = computed(() => {
  const links = [
    {
      label: 'Delivery',
      disabled: false,
      href: '/cart',
    },
    {
      label: 'Shipment',
      disabled: true,
      href: '/cart/shipment',
    },
    {
      label: 'Payment',
      disabled: true,
      href: '/cart/payment',
    }
  ]

  if (route.path === '/cart/shipment' || route.path === '/cart/payment') {
    links[1].disabled = false
  }
  
  return links
})

/**
 * Cart
 */

const { cartTotal, numberOfProducts } = await useCartInformation()

/**
 * SEO
 */

useHead({
  title: t('Cart'),
  meta: [
    {
      key: 'description',
      content: ''
    }
  ],
  // script: [
  //   {
  //     async: true,
  //     src: 'https://js.stripe.com/v3/'
  //   }
  // ]
})
</script>>
