<template>
  <section id="payment">
    <header>
      <nav class="flex justify-center uppercase pa-5">
        <NuxtLinkLocale id="link-home-cart-navbar" to="/">
          <h1 class="font-2xl font-bold">
            {{ $t('Boutique') }}
          </h1>
        </NuxtLinkLocale >
      </nav>
    </header>

    <div class="container mx-auto px-10">
      <div v-if="isSuccessPage" class="my-5">
        <slot />
      </div>

      <div v-else class="my-5 grid grid-cols-12 gap-4">
        <div class="col-span-12">
          <TailCard class="shadow-none border-none">
            <TailCardContent>
              <TailBreadcrumb>
                <TailBreadcrumbList>
                  <template v-for="(link, i) in paymentLinks" :key="link.title">
                    <TailBreadcrumbItem>
                      <TailBreadcrumbLink id="link-breadcrumb-cart" :to="link.href">
                        {{ link.title }}
                      </TailBreadcrumbLink>
                    </TailBreadcrumbItem>

                    <TailBreadcrumbSeparator v-if="i < 2">
                      <Slash />
                    </TailBreadcrumbSeparator>
                  </template>
                </TailBreadcrumbList>
              </TailBreadcrumb>
            </TailCardContent>
          </TailCard>
        </div>

        <div class="col-span-6">
          <slot />
        </div>

        <div class="col-span-6">
          <TailCard class="card border-none bg-gray-50">
            <TailCardHeader>
              <TailCardTitle>
                {{ $t('Résumé', { n: cartStore.numberOfProducts }) }}
              </TailCardTitle>
            </TailCardHeader>

            <TailCardContent id="products" class="card-body">
              <div class="list-group">
                <CartIterator :is-editable="false" />
              </div>
            </TailCardContent>

            <TailCardFooter>
              <div class="flex flex-col w-full">
                <div class="price flex justify-between w-full">
                  <div class="w-full">{{ $t('Sous-total') }}</div>
                  <div class="font-bold">{{ $n(cartStore.cartTotal, 'currency') }}</div>
                </div>

                <div class="delivery flex justify-between my-2 w-full">
                  <span>{{ $t("Frais d'envoi") }}</span>

                  <div class="font-bold uppercase text-green-500">
                    {{ $t('Gratuit') }}
                  </div>
                </div>

                <div class="total flex justify-between w-full">
                  <div class="p-5">{{ $t('Total (TVA comprise)') }}</div>
                  <div class="font-bold">{{ $n(cartStore.cartTotal, 'currency') }}</div>
                </div>
              </div>
            </TailCardFooter>
          </TailCard>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Slash } from 'lucide-vue-next'

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

useHead({
  title: t('Cart'),
  meta: [
    {
      key: 'description',
      content: ''
    }
  ],
  script: [
    {
      async: true,
      src: 'https://js.stripe.com/v3/'
    }
  ]
})
</script>>
