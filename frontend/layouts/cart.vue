<template>
  <section id="payment">
    <header>
      <nav class="flex justify-center uppercase pa-5">
        <NuxtLink id="link-shop-payment" to="/">
          <h1 class="font-2xl font-bold">
            {{ $t('Boutique') }}
          </h1>
        </NuxtLink>
      </nav>
    </header>

    <div class="container mx-auto px-10">
      <div v-if="isSuccessPage" class="my-5">
        <slot />
      </div>

      <div v-else class="my-5 grid grid-cols-12 gap-4">
        <div class="col-span-12">
          <nav aria-label="breadcrumb">
            <v-breadcrumbs :items="paymentLinks">
              <template #divider>
                <Icon name="ic:baseline-chevron-right" size="25" />
              </template>
            </v-breadcrumbs>
          </nav>
        </div>

        <div class="col-span-6">
          <slot />
        </div>

        <div class="col-span-6">
          <TailCard class="card border-none bg-gray-50">
            <TailCardHeader>
              <TailCardTitle>
                Résumé ({{ cartStore.numberOfProducts }})
              </TailCardTitle>
            </TailCardHeader>

            <TailCardContent id="products" class="card-body">
              <div class="list-group">
                <CartIterator :is-editable="false" />
              </div>
            </TailCardContent>

            <TailCardFooter>
              <div class="price flex justify-between">
                <span>Sous-total</span>
                <span class="fw-bold">{{ $n(cartStore.cartTotal, 'currency') }}</span>
              </div>

              <div class="delivery flex justify-between my-2">
                <span>
                  {{ $t("Frais d'envoi") }}
                </span>

                <span class="font-bold uppercase text-green-500">
                  {{ $t('Gratuit') }}
                </span>
              </div>

              <div class="total flex justify-between">
                <span>Total (TVA comprise)</span>
                <span class="font-bold">{{ $n(cartStore.cartTotal, 'currency') }}</span>
              </div>
            </TailCardFooter>
          </TailCard>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useHead({
  script: [
    {
      async: true,
      src: 'https://js.stripe.com/v3/'
    }
  ]
})

const cartStore = useCart()
const route = useRoute()

// Checks if the user has reached the success page
const isSuccessPage = computed(() => {
  return route.path === '/cart/success'
})

const paymentLinks = computed(() => {
  const links = [
    {
      title: 'Delivery',
      disabled: false,
      href: '/cart',
    },
    {
      title: 'Shipment',
      disabled: true,
      href: '/cart/shipment',
    },
    {
      title: 'Payment',
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
 * Calculate the individual price for the given
 * product with price and quantity variables
 */
function calculateItemTotalCost (price: number, quantity: number) {
  return price * quantity
}
</script>>

<style scoped>
#products {
  overflow-y: scroll;
  height: 400px;
}
</style>
