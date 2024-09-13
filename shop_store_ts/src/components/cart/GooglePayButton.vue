<template>
  <div class="example">
    <div ref="googlePay" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useScript } from 'unhead'

// https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters
const allowedCardNetworks = [
  "MASTERCARD",
  "VISA"
]

// Card authentication methods supported by your site and your gateway
const allowedCardAuthMethods = [
  "PAN_ONLY",
  "CRYPTOGRAM_3DS"
]

export default {
  name: 'GooglePayButton',
  props: {
    totalPrice: {
      type: String,
      default: "0.00",
      required: true,
    },
  },
  emits: {
    'payment-success' () {
      return true
    },
    'payment-error' () {
      return true
    },
    'loaded-error' () {
      return true
    },
    'loaded' () {
      return true
    }
  },
  setup () {
    useScript({
      src: 'https://pay.google.com/gp/p/js/pay.js'
    })

    // Define the version of the Google Pay API referenced when creating your
    // configuration : https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|apiVersion 
    // in PaymentDataRequest
    const baseRequest = ref({
      apiVersion: 2,
      apiVersionMinor: 0,
    })

    // Identify your gateway and your site's gateway merchant identifier
    // The Google Pay API response will return an encrypted payment method capable
    // of being charged by a supported gateway after payer authorization :
    // https://developers.google.com/pay/api/web/reference/request-objects#gateway|PaymentMethodTokenizationSpecification
    const tokenizationSpecification = ref({
      type: "PAYMENT_GATEWAY",
      parameters: {
        gateway: import.meta.env.VUE_APP_GOOGLE_PAY_GATEWAY,
        gatewayMerchantId: import.meta.env.VUE_APP_GOOGLE_PAY_GATEWAY_MERCHANT_ID,
      }
    })

    return {
      baseRequest,
      allowedCardNetworks,
      allowedCardAuthMethods,
      tokenizationSpecification
    }
  },
  mounted () {
    this.$refs.googlePay
    this.totalPrice
    // setTimeout(() => this.loadGooglePay(), 2000)
  },
  // methods: {
  //   loadGooglePay () {
  //     // See: https://github.com/lavesan/google-pay-vue/blob/master/src/components/GooglePay.vue

  //     // Describe your site's support for the CARD payment 
  //     // method and its required fields
  //     const baseCardPaymentMethod = {
  //       type: "CARD",
  //       parameters: {
  //         allowedAuthMethods: this.config.allowedCardAuthMethods,
  //         allowedCardNetworks: this.config.allowedCardNetworks,
  //       }
  //     }

  //     // Describe your site's support for the CARD payment 
  //     // method including optional fields
  //     const cardPaymentMethod = Object.assign({}, baseCardPaymentMethod, {
  //       tokenizationSpecification: this.config.tokenizationSpecification,
  //     })

  //     let paymentsClient = null

  //     const getGoogleIsReadyToPayRequest = () => {
  //       return Object.assign({}, this.config.baseRequest, {
  //         allowedPaymentMethods: [baseCardPaymentMethod],
  //       })
  //     }

  //     function getGoogleTransactionInfo () {
  //       return {
  //         countryCode: "US",
  //         currencyCode: "USD",
  //         totalPriceStatus: "FINAL",
  //         // set to cart total
  //         totalPrice: this.totalPrice,
  //       }
  //     }

  //     function getGooglePaymentDataRequest () {
  //       const paymentDataRequest = Object.assign({}, this.config.baseRequest);
  //       paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
  //       paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
  //       paymentDataRequest.merchantInfo = {
  //         // @todo a merchant ID is available for a production environment after approval by Google
  //         // See {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist|Integration checklist}
  //         merchantId: process.env.VUE_APP_GOOGLE_PAY_MERCHANT_ID,
  //         merchantName: process.env.VUE_APP_GOOGLE_PAY_MERCHANT_NAME,
  //       };
  //       return paymentDataRequest;
  //     }

  //     function getGooglePaymentsClient () {
  //       if (paymentsClient === null) {
  //         paymentsClient = new google.payments.api.PaymentsClient({
  //           // Alterar o environment para 'PRODUCTION' em prod
  //           environment: process.env.VUE_APP_GOOGLE_PAY_ENVIRONMENT,
  //         })
  //       }
  //       return paymentsClient;
  //     }

  //     function addGooglePayButton () {
  //       const paymentsClient = getGooglePaymentsClient();
  //       const button = paymentsClient.createButton({
  //         onClick: onGooglePaymentButtonClicked,
  //       });
  //       this.$refs.googlePay.appendChild(button);
  //     }

  //     function onGooglePayLoaded () {
  //       const paymentsClient = getGooglePaymentsClient();
  //       paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest()).then((response) => {
  //         if (response.result) {
  //           addGooglePayButton();
  //           // @todo prefetch payment data to improve performance after confirming site functionality
  //           // prefetchGooglePaymentData();
  //           this.$emit('loaded', response.result);
  //         }
  //       })
  //       .catch((err) => {
  //         // show error in developer console for debugging
  //         console.error(err);
  //         this.$emit('loaded-error', err);
  //       })
  //     }

  //     function processPayment (paymentData) {
  //       // show returned data in developer console for debugging
  //       console.log(paymentData);
  //       // @todo pass payment token to your gateway to process payment
  //       const paymentToken =
  //         paymentData.paymentMethodData.tokenizationData.token;
  //       this.$emit('payment-success', paymentToken);
  //     }

  //     function onGooglePaymentButtonClicked () {
  //       const paymentDataRequest = getGooglePaymentDataRequest();
  //       paymentDataRequest.transactionInfo = getGoogleTransactionInfo();

  //       const paymentsClient = getGooglePaymentsClient();
  //       paymentsClient.loadPaymentData(paymentDataRequest).then((paymentData) => {
  //         // handle the response
  //         processPayment(paymentData);
  //       })
  //       .catch((err) => {
  //         // show error in developer console for debugging
  //         console.error(err);
  //         this.$emit('payment-error', err);
  //       })
  //     }

  //     onGooglePayLoaded()
  //   }
  // }
}
</script>
