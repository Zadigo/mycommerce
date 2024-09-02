import axios from 'axios'
import { onBeforeMount, ref } from 'vue'

export function useGooglePay () {
  const klarnaClient = axios.create({
    baseURL: null,
  })

  const billingAddress = ref({
    given_name: "Alice",
    family_name: "Test",
    email: "customer@email.se",
    street_address: "Södra Blasieholmshamnen 2",
    postal_code: "11 148",
    city: "Stockholm",
    phone: "+46701740615",
    country: "SE"
  })
  const shippingAddress = ref({
    given_name: "Alice",
    family_name: "Test",
    email: "customer@email.se",
    street_address: "Södra Blasieholmshamnen 2",
    postal_code: "11 148",
    city: "Stockholm",
    phone: "+46701740615",
    country: "SE"
  })
  const customer = ref({
    date_of_birth: "1941-03-21",
  })

  window.klarnaAsyncCallback = function () {
    window.Klarna.Payments.init({
      client_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ.dtxWM6MIcgoeMgH87tGvsNDY6cH'
    })
  }

  onBeforeMount(() => {
    window.Klarna.Payments.load(
      {
        container: '#klarna-payments-container'
      },
      {},
      function (res) {
        console.debug(res);
      }
    )
  })

  function handleKlarnaPayment () {
    window.Klarna.Payments.authorize(
      {},
      {
        billing_address: billingAddress.value,
        shipping_address: shippingAddress.value
      },
      function (res) {
        console.debug(res)
      }
    )
  }

  return {
    customer,
    billingAddress,
    shippingAddress,
    klarnaClient,
    handleKlarnaPayment
  }
}

export function useKlarna () {

}
