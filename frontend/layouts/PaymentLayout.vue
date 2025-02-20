<template>
  <section id="payment">
    <header>
      <nav class="navbar fixed-top navbar-dark bg-white d-flex justify-content-center shadow-none text-uppercase">
        <NuxtLink to="/" class="link-dark">
          <h1 class="h2 fw-bold">
            {{ $t('Boutique') }}
          </h1>
        </NuxtLink>
      </nav>
    </header>

    <div class="container">
      <div v-if="isSuccessPage" class="row my-5">
        <div class="col-8 offset-md-2">
          <slot />
        </div>
      </div>

      <div v-else class="row my-5">
        <div class="col-12">
          <nav aria-label="breadcrumb">
            <v-breadcrumbs :items="paymentLinks">
              <template #divider>
                <v-icon icon="mdi-chevron-right" />
              </template>
            </v-breadcrumbs>
          </nav>
        </div>

        <div class="col-6">
          <slot />
        </div>

        <div class="col-6">
          <div class="card shadow-none bg-light">
            <div class="card-header border-none">
              <h1 class="fs-5 fw-bold my-2">
                Résumé ({{ cartStore.numberOfProducts }})
              </h1>
            </div>

            <div id="products" class="card-body">
              <div class="list-group">
                <CartIterator :is-editable="false" />
              </div>
            </div>

            <div class="card-footer border-none">
              <div class="price d-flex justify-content-between">
                <span>Sous-total</span>
                <span class="fw-bold">{{ $n(cartStore.cartTotal, 'currency') }}</span>
              </div>

              <div class="delivery d-flex justify-content-between my-2">
                <span>
                  {{ $t("Frais d'envoi") }}
                </span>

                <span class="fw-bold text-uppercase text-success">
                  {{ $t('Gratuit') }}
                </span>
              </div>

              <div class="total d-flex justify-content-between">
                <span>Total (TVA comprise)</span>
                <span class="fw-bold">{{ $n(cartStore.cartTotal, 'currency') }}</span>
              </div>
            </div>
          </div>
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

const route = useRoute()

const isSuccessPage = computed(() => {
  // Checks if the user has reached the success page
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

const cartStore = useCart()

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
