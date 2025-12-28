<template>
  <section id="cart">
    <div class="grid grid-cols-12">
      <!-- Header -->
      
      <div class="col-span-12 order-2 md:order-1 md:col-span-8 md:h-screen p-5">
        <header class="p-2 text-center border-b border-primary-50">
          <h1 class="font-2xl font-bold uppercase p-2">
            <nuxt-link-locale id="link-home-cart-navbar" to="/">
              {{ $t('Boutique') }}
            </nuxt-link-locale>
          </h1>
        </header>

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

        <div class="grid grid-cols-1 md:grid-cols-2">
          <cart-iterator :is-editable="false" />
        </div>
      </div>

      <div class="col-span-12 order-1 md:order-2 md:col-span-4 md:h-screen p-5 bg-primary-50">
        <volt-card class="border-none bg-gray-50 mb-5">
          <template #title>
            {{ $t('Résumé', { n: cartSession?.numberOfItems || 0 }) }}
          </template>

          <template #footer>
            <div class="flex flex-col w-full">
              <div class="price flex justify-between w-full">
                <div class="w-full">{{ $t('Sous-total') }}</div>
                <div class="font-bold">{{ $n(cartSession?.total || 0, 'currency') }}</div>
              </div>

              <div class="delivery flex justify-between my-2 w-full">
                <span>{{ $t("Frais d'envoi") }}</span>

                <div class="font-bold uppercase text-green-500">
                  {{ $t('Gratuit') }}
                </div>
              </div>

              <div class="total flex justify-between items-center w-full mt-5">
                <div class="font-semibold">{{ $t('Total (TVA comprise)') }}</div>
                <div class="font-bold">{{ $n(cartSession?.total || 0, 'currency') }}</div>
              </div>
            </div>
          </template>
        </volt-card>

        <slot />
      </div>
    </div>

    <!-- Modals -->
    <client-only>
      <modals-login /> 
    </client-only>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

// Checks if the user has reached the success page
const isSuccessPage = computed(() => route.path === '/cart/success')

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
    const item = links[1]
    if (item) item.disabled = false
  }
  
  return links
})

/**
 * Cart
 */

const { cartSession } = useCartComposable()

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
