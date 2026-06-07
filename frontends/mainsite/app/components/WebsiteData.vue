<template>
  <dev-only>
    <client-only>
      <template #default>
        <div ref="divEl" :style="style" class="fixed top-1/12 cursor-move right-5 bg-white/5 backdrop-blur-md hover:bg-white/70 rounded-lg shadow-xl p-4 z-50 w-100 space-y-5">
          <p>Show login drawer: {{ showLoginDrawer }}</p>
          <p>Show cart drawer: {{ showCartDrawer }}</p>
          <p class="font-bold text-2xl">Website & Firebase data</p>
          <div class="h-30 overflow-y-scroll rounded-md p-3 inset-shadow-sm">{{ cartSession }}</div>
          <div class="h-30 overflow-y-scroll rounded-md p-3 inset-shadow-sm">Cart: {{ cart }}</div>
          <p><span class="font-bold">Session initialized:</span> {{ isInitialized }}</p>
          <p><span class="font-bold">Session ID:</span> {{ sessionId }}</p>
          <p><span class="font-bold">Cart ID:</span> {{ cartSessionId }}</p>


          <p><span class="font-bold">Payment Intent:</span> {{ paymentIntent }}</p>
          <p><span class="font-bold">Has Payment Intent:</span> {{ hasPaymentIntent }}</p>

          <volt-button @click="() => { void create(cartSession?.total) }">
            Test payment intent
          </volt-button>
        </div>
      </template>

      <template #fallback>
        Loading website data...
      </template>
    </client-only>
  </dev-only>
</template>

<script lang="ts" setup>
const { sessionId, isInitialized } = useSession()
const { cartSession, cart, cartSessionId } = useCartComposable()

const divEl = useTemplateRef<HTMLDivElement>('divEl')

const { x, y, style } = useDraggable(divEl, {
  initialValue: { x: 40, y: 40 },
})

/**
 * Save State
 */

const positions = useLocalStorage('website-data-position', { x: 40, y: 40 })

watchDebounced([x, y], ([newX, newY]) => {
  positions.value = { x: newX, y: newY }
}, { debounce: 2000 })

onMounted(() => {
  if (isDefined(positions)) {
    x.value = positions.value.x
    y.value = positions.value.y
  }
})

/**
 * Modals
 */

const showLoginDrawer = useState<boolean>('showLoginDrawer')
const showCartDrawer = useState<boolean>('showCartDrawer')

/**
 * Payment Intent
 */

const { create, hasPaymentIntent, paymentIntent } = usePaymentIntentComposable()
</script>
