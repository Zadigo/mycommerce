<template>
  <section id="orders">
    <v-row>
      <v-col cols="8" class="offset-md-2">

        <v-toolbar class="mb-2">
          <v-toolbar-title>
            Vos commandes
          </v-toolbar-title>

          <template v-slot:extension>
            <v-tabs v-model="selectedTab" align-with-title>
              <v-tab v-for="i in ['Commandes', 'Acheter à nouveau', 'En attente d expédition']" :key="i">{{ i }}</v-tab>
            </v-tabs>
          </template>
        </v-toolbar>


        <v-tabs-items v-model="selectedTab">
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <div class="d-flex jusify-content-betwen">
                      <v-text-field type=" text" v-model="search" placeholder="Search orders" solo hide-details></v-text-field>

                      <v-menu :close-on-content-click="true" :open-on-hover="false" :rounded="false" transition="scale-transition">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn v-bind="attrs" v-on="on">Commandes passées</v-btn>
                        </template>

                        <v-list>
                          <v-list-item>
                            <v-list-item-title>Trois dernier mois</v-list-item-title>
                          </v-list-item>

                          <v-list-item>
                            <v-list-item-title>2022</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </v-col>

                  <v-col cols="12">
                    <v-expansion-panels>
                      <v-expansion-panel v-for="customerOrder in customerOrders" :key="customerOrder.id" accordion>
                        <v-expansion-panel-header>
                          {{ customerOrder.created_on}} / N° de commande: {{ customerOrder.reference }}
                        </v-expansion-panel-header>

                        <v-expansion-panel-content>
                          <v-row v-for="product in customerOrder.products" :key="product.id">
                            <v-col cols="3">
                              <router-link :to="{ name: 'product', params: { lang: $i18n.locale, id: product.product.id, slug: product.product.slug } }">
                                <v-img :src="getProductMainImage(product.product.images)['thumbnail']|mediaUrl"></v-img>
                              </router-link>
                            </v-col>

                            <v-col cols="auto">
                              <p>{{ product.product.name }}</p>

                              <div>
                                <v-btn>Acheter à nouveau</v-btn>
                                
                                <v-menu :close-on-content-click="true" :open-on-hover="false" :rounded="false" transition="scale-transition">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-bind="attrs" v-on="on" class="ml-2">
                                      <v-icon>mdi-dots-horizontal</v-icon>
                                    </v-btn>
                                  </template>

                                  <v-list>
                                    <v-list-item>
                                      <v-list-item-title>Suivre le colis</v-list-item-title>
                                    </v-list-item>
                                    
                                    <v-list-item>
                                      <v-list-item-title>Retourner l'article</v-list-item-title>
                                    </v-list-item>
                                    
                                    <v-list-item>
                                      <v-list-item-title>Ecrire un commentaire sur le produit</v-list-item-title>
                                    </v-list-item>
                                    
                                    <v-divider></v-divider>

                                    <v-list-item>
                                      <v-list-item-title>Assistance technique</v-list-item-title>
                                    </v-list-item>
                                  </v-list>
                                </v-menu>
                              </div>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <v-card-text>
                2
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>

      </v-col>
    </v-row>

  </section>
</template>

<script>
export default {
  name: 'YourOrders',

  data: () => ({
    search: null,
    selectedTab: 0,

    customerOrders: []
  }),

  mounted() {
    this.$api.auth.myOrders()
    .then((response) => {
      this.customerOrders = response.data
    })
    .catch((error) => {
      error
    })
  }
}
</script>
