<template>
  <section id="shipment" class="ecommerce-section">
    <div class="container">
      <div class="row">
        <div class="col-8">
          <!-- Shipment -->
          <div v-if="currentStep >= 2" class="card mb-2">
            <div class="card-body">
              <p class="fw-bold mb-1">{{ $t('Delivery between', { date1: '24/06/22', date2: '27/06/22' }) }}</p>
              <p class="fw-bold">Colissimo - Livraison standard</p>

              <p class="m-0">Lucile Pauline</p>
              <p class="m-0">1 rue abbe de la rue</p>
              <p class="m-0">14000 Caen</p>
              <p class="m-0">France</p>
              <p class="m-0">lucile@gmail.com</p>

              <button type="button" class="btn btn-info btn-sm mt-4" @click="changeStep(1)">
                {{ $t('Change') }}
              </button>
            </div>
          </div>

          <transition name="opacity" mode="out-in">

            <div v-if="currentStep === 1" id="shipment-infos" class="card">
              <div class="card-body">
                <div v-for="field in fields" :key="field.name" :class="`col-${field.col}`">
                  <input v-model="options[field.name]" :type="field.type" :autocomplete="field.autocomplete" :placeholder="field.name" class="form-control p-2 mb-2">
                </div>

                <button class="btn btn-lg btn-primary mt-2" @click="changeStep(2)">
                  {{ $t('Validate') }}
                </button>
              </div>
            </div>

            <!-- Delivery -->
            <div v-else-if="currentStep === 2" id="delivery-method" class="card mt-2">
              <div class="card-body">
                <p class="fw-bold fs-5">
                  {{ $t('Choose your delivery method') }}
                </p>

                <a v-for="(delivery, i) in deliveryMethods" :key="i" href :class="{ 'border': delivery === options.delivery_mode }" class="card shadow-sm text-dark my-2" @click.prevent="options.delivery_mode = delivery">
                  <div class="card-body">
                    <p class="fw-bold d-flex justify-content-between">
                      <span>{{ delivery }}</span>
                      <span>4.90€</span>
                    </p>
                    <p>{{ $t('Delivery between', { date1: '24/06/22', date2: '27/06/22' }) }}</p>
                  </div>
                </a>

                <button class="btn btn-lg btn-primary text-right mt-2" @click="changeStep(3)">
                  {{ $t('Passer commande') }}
                </button>
              </div>
            </div>

            <!-- Payment -->
            <div v-else-if="currentStep === 3" class="card mt-2">
              <div class="card-body">
                <p class="fw-bold fs-5">
                  {{ $t('Choose a payment method') }}
                </p>

                <p class="text-muted">
                  Votre paiement est sécurisé
                </p>

                <div class="form-check">
                  <input class="form-check-input" type="radio" name="delivery-mode" checked>
                  <label class="form-check-label" for="delivery-mode">
                    Carte de crédit
                  </label>
                </div>

                <hr class="my-4">

                <!-- <stripe-element-card /> -->

                <button class="btn btn-lg btn-block btn-primary my-3" @click="completePayment">
                  <div class="spinner-border spinner-border-sm me-2" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  {{ $t('Pay') }} - $123
                </button>

                <p>
                  En validant ma commande, je déclare avoir pris connaissance et accepté
                  sans réserve les <router-link :to="{ name: 'shop_view' }">Conditions générales de vente.</router-link>
                </p>

                <p>
                  Je reconnais avoir lu et accepté la <router-link :to="{ name: 'shop_view' }">Charte de confidentialité
                  </router-link>.
                </p>

              </div>
            </div>
          </transition>
        </div>

        <!-- Aside -->
        <cart-aside-vue :grand-total="20" :show-actions="false" />
      </div>
    </div>
  </section>
</template>

<script>
import CartAsideVue from '../../components/shop/cart/CartAside.vue'
import { useShop } from '../../store/shop'
// import { StripeElementCard } from '@vue-stripe/vue-stripe'

export default {
  name: 'ShipmentView',
  components: {
    CartAsideVue
    // StripeElementCard
  },
  setup () {
    var store = useShop()
    return {
      store
    }
  },
  data: () => ({
    currentStep: 1,
    options: {
      delivery_mode: 'Colissimo - Standard'
    },
    paymentMethod: null,
    fields: [],
    deliveryMethods: [
      'Colissimo - Standard',
      'Colissimo - Standard2'
    ],
    processing: false
  }),

  // Nous utilisons des cookies pour améliorer votre expérience, ainsi qu'à des fins de marketing. Pour en savoir plus, consultez notre politique sur l'utilisation des cookies.

  beforeMount () {
    var fields = [
      { name: 'email', type: 'email', autocomplete: 'email', col: 12 },
      { name: 'lastname', type: 'text', autocomplete: 'given-name', col: 6 },
      { name: 'firstname', type: 'text', autocomplete: 'family-name', col: 6 },
      { name: 'address', type: 'text', autocomplete: 'address-level-1', col: 12 },
      { name: 'zip_code', type: 'text', autocomplete: 'email', col: 12 },
      { name: 'city', type: 'text', autocomplete: 'address-level-2', col: 12 },
      { name: 'country', type: 'text', autocomplete: 'country', col: 12 },
      { name: 'telephone', type: 'tel', autocomplete: 'tel', col: 12 }
    ]
    fields.forEach((field) => {
      this.options[field.name] = null
    })
    this.fields = fields
  },
  methods: {
    async completePayment () {
      try {
        const options = { session_id: this.localStorage.cart.session_id, ...this.options }
        const response = await this.$http.post('cart/payment', options)
        if (response.data.state) {
          this.$router.push({ name: 'success_page_view', query: { token: response.data.reference }, params: { lang: this.$i18n.locale } })
        } else {
          this.store.addErrorMessage('V-AX-PA: Could not complete payment')
        }
      } catch (error) {
        this.store.addErrorMessage('V-AX-PA: Could not complete payment')
      }
    },
    changeStep (step) {
      this.currentStep = step
    }
  }
}
</script>
