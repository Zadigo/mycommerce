<template>
  <section id="delivery-and-returns">
    <v-container>
      <v-row>
        <v-col cols="8" offset-md="2">
          
          <v-expansion-panels>

            <v-expansion-panel>
              <v-expansion-panel-header>
                Conscious delivery
              </v-expansion-panel-header>
             
              <v-expansion-panel-content>
                All our shipments are climate compensated at no extra cost to you! We plant a tree for 
                every order, so feel confident knowing you’re a sustainable shopper with Gooseberry! 
                Find more <b-link>here</b-link>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>
                Processing time
              </v-expansion-panel-header>
             
              <v-expansion-panel-content>
                All orders are shipped out within 2/3 business days of purchase from our warehouse in Bali. 
                Processing time may be extended during holidays, launches/re-stocks, limited edition releases 
                and promotions.
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>
                Shipping methods
              </v-expansion-panel-header>
             
              <v-expansion-panel-content>
                All orders are shipped through DHL EXPRESS with an approximate delivery time of 3-6 business days. 
                Estimated delivery times serve as guidelines and do not take into account delays caused by payment 
                authorization, customs clearance processes or other unforeseen events we 
                do not take responsibility for.

                <p>
                  DHL EXPRESS RATE: 

                  INTERNATIONAL: FREE for orders over $100
                  $10 flat fee for orders under $100 
                  $20 flat fee on orders under $50

                  OUT OF RANGE COUNTRIES: FREE for orders over $100
                  $30 flat fee for orders under $80: Albania, Azerbaijan, Belarus, Bermuda, Brazil, Chile, Colombia, Croatia, Estonia, French Polynesia, Greece, Israel, Kazakhstan, Kuwait, Latvia, Lebanon, Luxembourg, North Macedonia, Moldova, Montenegro, Norway, Pakistan, Peru, Portugal, Romania, Serbia, Sint Maarten, Slovakia, Slovenia, South Africa, Turkey, Ukraine, U.S. Outlying Islands, Uzbekistan, Venezuela, Qatar, Cyprus, Hungary, Poland

                  Certain out of range countries/and regional or remote areas within Australia are not supported by DHL and will be shipped with regular express post (5-10 business days).
                </p>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>
                Track your order
              </v-expansion-panel-header>
             
              <v-expansion-panel-content>
                To track your order click <router-link :to="{ name: 'how_to_track', params: { lang: $i18n.locale } }">here</router-link>
              </v-expansion-panel-content>
            </v-expansion-panel>
            
            <v-expansion-panel>
              <v-expansion-panel-header>
                Change your order
              </v-expansion-panel-header>
             
              <v-expansion-panel-content>
                If you need to change your order, please contact us immediately. We pack and ship orders 
                daily so cannot guarantee your requests can be made. Once orders have been confirmed in our 
                system they are unable to be changed.
              </v-expansion-panel-content>
            </v-expansion-panel>
            
            <v-expansion-panel>
              <v-expansion-panel-header>
                Restrictions
              </v-expansion-panel-header>
             
              <v-expansion-panel-content>
                We are unable to ship to PO Boxes and to the following countries: Russia, China, Hong Kong, Ukraine, Saudi-Arabia, Maldives, 
                certain countries in Africa & the Pacifics.
              </v-expansion-panel-content>
            </v-expansion-panel>
            
            <v-expansion-panel>
              <v-expansion-panel-header>
                Taxes and duties
              </v-expansion-panel-header>
             
              <v-expansion-panel-content>
                We currently ship all items delivery duty unpaid (DDU). Gooseberry is not responsible for any 
                customs charges or local taxes due to international shipment. Please familiarize yourself 
                with your countries regulations as payment of these duties may be necessary to release your order. 
                Note: there are NO customs duties incurred on parcels within Australia.

                If you refuse a shipment from Gooseberry you are responsible for the original shipping 
                charges, any import fees that may have incurred on the package, as well as the cost of returning 
                your order parcel to Gooseberry. This amount will be deducted from your order refund once the 
                shipment has been received back.

                If you require more information on shipping, our customer service team HERE. 
                By placing an order you are acknowledging and accepting all 
                the international shipping terms. 
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>
                Full price orders
              </v-expansion-panel-header>
             
              <v-expansion-panel-content>
                We want you to be completely satisfied with your online purchase. If you change your mind for 
                any reason you can simply return your item(s) to our warehouse in Bali, Indonesia for a 
                STORE-CREDIT of the item's value within 21 days of receipt. Our return policy is valid for 
                21 days, unfortunately if 21 have passed since you've received your purchase we are unable 
                to offer you a store-credit or exchange.
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>
                Sale
              </v-expansion-panel-header>
             
              <v-expansion-panel-content>
                We do not accept exchanges or returns on items purchased on sale or items purchased 
                using a discount code as part of a sale promotion, all discounted items are considered 
                final sale, unless the items are faulty and proof is provided by the customer.

                Item/s must be returned in original condition, unworn, unaltered, 
                unwashed and with their tags attached. Damaged returns and returns sent 
                back without prior authorization will be returned to sender. Gift Cards may not be returned. 
                Store-credit do not expire and can be used toward anything on our site.
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>
                Initiate a return
              </v-expansion-panel-header>
             
              <v-expansion-panel-content>
                Visit <b-link href="https://example.returnscenter.com" target="_blank">our return center</b-link>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
         
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
export default {
  name: 'DeliveryAndReturnsView',
  
  title: function () {
    return this.$i18n.t('Delivery and returns')
  }
}
</script>
