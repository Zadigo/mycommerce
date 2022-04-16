<template>
  <section id="shipment" class="ecommerce-section">
    <div class="container">
      <div class="row">
        <div class="col-sm-12 col-md-5 offset-md-2">

          <div id="shipment-infos" class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-12">
                  <div class="row">
                    <div v-for="field in fields" :key="field.name" :class="`col-${field.col}`">
                      <v-text-field v-model="options[field.name]" :type="field.type" :autocomplete="field.autocomplete" :placeholder="field.name" solo hide-details></v-text-field>
                    </div>
                  </div>
                </div>

                <div class="col-12">
                  <p class="font-weight-bold">{{ options.firstname }} {{ options.lastname }}</p>
                  <p class="font-weight-bold">{{ options.address }}, {{ options.zip_code }}</p>
                  <p class="font-weight-bold">{{ options.city }}</p>
                </div>

                <button class="btn btn-lg btn-primary">
                  {{ $t('Validate') }}
                </button>
              </div>
            </div>
          </div>

          <div id="delivery-method" class="card mt-2">
            <div class="card-body">
              <!-- Choisir votre mode de livraison -->
              {{ $t('Choose your delivery method') }}

              <v-radio v-model="options.delivery_mode" :label="options.delivery_mode"></v-radio>
            </div>
          </div>

          <div id="payment-method" class="card mt-2">
            <div class="card-body">
              <p class="font-weight-bold">
                <!-- Choisissez un mode de paiement -->
                {{ $t('Choose a payment method') }}
              </p>
              
              <span>
                <v-icon class="mr-2">mdi-lock</v-icon>
                <!-- Votre paiement est sécurisé -->
                {{ $t('Your payment is secured') }}
              </span>

              <v-radio-group v-model="paymentMethod">
                <v-radio v-for="method in ['Carte de crédit', 'Paypal']" :key="method" :label="method" :value="method"></v-radio>
              </v-radio-group>

              <hr>

              <p>
                En validant ma commande, je déclare avoir pris connaissance et accepté 
                sans réserve les <router-link :to="{ name: 'home' }">Conditions générales de vente.</router-link>
              </p>
              
              <p>
                Je reconnais avoir lu et accepté la <router-link :to="{ name: 'home' }">Charte de confidentialité</router-link>.
              </p>

              <button class="btn btn-lg btn-block btn-primary">
                {{ $t('Pay') }}
              </button>
            </div>
          </div>

        </div>

        <div class="col-sm-12 col-md-4">
          <div class="card">
            <div class="card-body">
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import { StripeElementCard } from '@vue-stripe/vue-stripe'

export default {
  name: 'ShipmentView',
  components: {
    // StripeElementCard
  },
  data: () => ({
    options: {
      delivery_mode: 'Colissimo - Standard'
    },
    paymentMethod: null,
    fields: [],
    currentStep: 1
  }),

  // Nous utilisons des cookies pour améliorer votre expérience, ainsi qu'à des fins de marketing. Pour en savoir plus, consultez notre politique sur l'utilisation des cookies.

  beforeMount() {
    var fields = [
      { name: 'email', type: 'email', autocomplete: 'email', col: 12 },
      { name: 'lastname', type: 'text', autocomplete: 'given-name', col: 6 },
      { name: 'firstname', type: 'text', autocomplete: 'family-name', col: 6 },
      { name: 'address', type: 'text', autocomplete: 'address-level-1', col: 12 },
      { name: 'zip_code', type: 'text', autocomplete: 'email', col: 12 },
      { name: 'city', type: 'text', autocomplete: 'address-level-2', col: 12 },
      { name: 'country', type: 'text', autocomplete: 'country', col: 12 },
      { name: 'telephone', type: 'tel', autocomplete: 'tel', col: 12 },
    ]
    fields.forEach((field) => {
      this.options[field.name] = null
    })
    this.fields = fields
  }
}
</script>
