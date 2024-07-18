<template>
  <section id="shop">
    <!-- Navbar -->
    <base-navbar @display-search="showSearchModal = true" />
    
    <base-messages />
    
    <main>
      <slot></slot>
    </main>

    <!-- Footer -->
    <base-footer />

    <!-- Login -->
    <v-navigation-drawer id="dialog-login" v-model="authenticationStore.showLoginDrawer" width="400" location="right" temporary>
      <v-container>
        <div class="row">
          <div class="col-12">
            <div class="d-flex flex-column justify-content-center" style="height: 100vh;">
              <h3 class="h5">Connecte-toi ou crée un compte</h3>

              <v-form id="form-login" @submit.prevent>
                <v-text-field v-model="email" variant="outlined" type="email" placeholder="Email" autocomplete="email"></v-text-field>
                <v-text-field v-model="password" variant="outlined" type="password" placeholder="Password" autocomplete="current-password"></v-text-field>

                <v-btn color="primary" block @click="handleLogin">Se connecter</v-btn>
              </v-form>
            </div>
          </div>
        </div>
      </v-container>
    </v-navigation-drawer>

    <!-- Search -->
    <v-dialog id="dialog-search" v-model="showSearchModal" transition="dialog-bottom-transition" fullscreen>
      <v-card>
        <v-toolbar>
          <v-toolbar-title class="fw-bold text-uppercase">Boutique</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" @click="showSearchModal = false"></v-btn>
        </v-toolbar>

        <v-card-text>
          <div class="container">
            <div class="row g-1">
              <div class="col-12">
                <v-text-field v-model="search" type="Search" placeholder="Ecris les produits à rechercher" variant="outlined" @keypress="searchProducts">
                  <template #prepend>
                    <v-icon name="search"></v-icon>
                  </template>
                </v-text-field>
              </div>
              
              <base-product-iterator v-if="canShowSearch" :products="searchedProducts" />

              <suspense v-else>
                <template #default>
                  <async-recommendations-block />
                </template>
                
                <template #fallback>
                  <loading-recommendations-block />
                </template>
              </suspense>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Added Product -->
    <v-navigation-drawer id="dialog-add-product" v-model="showAddedProductDrawer" location="right" width="400" temporary>
      <div class="container">
        <div class="row my-3">
          <div v-if="cartStore.hasProducts" class="col-12">
            <div class="d-flex justify-content-start mb-5 fs-5 align-items-center gap-2">
              <font-awesome-icon :icon="['fas', 'circle-check']" class="text-success" />
              <span>Ajouté au panier</span>
            </div>

            <div class="row">
              <div class="col-4">
                <v-img :src="parseMainImage(cartStore.lastAddedProduct.product)" :lazy-:src="parseMainImage(cartStore.lastAddedProduct.product)" :alt="cartStore.lastAddedProduct.product.name" />
              </div>

              <div class="col-8">
                <p class="fw-bold mb-1">{{ $n(parseFloat(cartStore.lastAddedProduct.product.get_price), 'currency') }}</p>
                <p class="mb-2">{{ cartStore.lastAddedProduct.product.name }}</p>
                <p class="text-body-secondary">Taille: {{ cartStore.lastAddedProduct.size }}</p>
              </div>
            </div>

            <div class="row my-3">
              <div class="col-12">
                <v-btn color="primary" block @click="handleNotAuthenticatedOrdering">
                  Passer commande
                </v-btn>

                <v-btn class="mt-2" variant="text" block @click="showAddedProductDrawer = false, showCartDrawer = true">
                  Voir le panier
                </v-btn>
              </div>
            </div>

            <h4 class="text-center h5">Autres produits</h4>
            <div class="row gx-1 gy-1 products-wrapper">
              <div v-for="i in 10" :key="i" class="col-4">
                <router-link :to="{ name: 'shop_product', params: { id: i } }" class="link-dark">
                  <img src="../assets/img7.jpeg" alt="" class="img-fluid">
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- Cart -->
    <v-navigation-drawer id="dialog-cart" v-model="showCartDrawer" location="right" width="400" temporary>
      <v-toolbar class="border-bottom" color="white">
        <v-toolbar-title class="fw-bold">Panier ({{ cartStore.numberOfProducts }})</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn :to="{ name: 'wishlist' }" rounded variant="outlined" @click="showCartDrawer = false">
          <font-awesome-icon :icon="['far', 'heart']" class="me-2" />
          Favoris
        </v-btn>
      </v-toolbar>

      <div class="container mt-1">
        <div class="row d-flex justify-content-between">
          <div v-if="cartStore.hasProducts" class="col-12 mt-4">
            <div class="card shadow-sm">
              <div class="card-body">
                <p v-if="cartStore.freeDeliveryTarget > 0" class="fw-light">
                  {{ cartTotal }}
                  {{ $t('Livraison gratuite offerte', { n: $n(cartStore.freeDeliveryTarget, 'currency') }) }}
                  <!-- Il te manque 19,02 € pour profiter de la -->
                  <span class="fw-bold text-primary text-uppercase">
                    livraison standard gratuite
                  </span>
                </p>

                <div v-else class="fw-light">
                  <p class="fw-bold text-success text-uppercase mb-1">
                    Livraison standard gratuite
                  </p>

                  <p class="fw-light">
                    Tu vas pouvoir profiter de la livraison standard gratuite à domicile
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="cartStore.hasProducts" class="col-12 my-3">
            <article v-for="item in cartStore.products" :key="item.product.id" class="card shadow-none border mb-1" :aria-label="item.product.name">
              <div class="card-body p-2">
                <div class="d-flex justify-content-start gap-2">
                  <div class="col-auto">
                    <v-img :src="parseMainImage(item.product)" :lazy-src="parseMainImage(item.product)" :alt="item.product.name" :width="150" :height="150" />
                  </div>

                  <div class="infos">
                    <router-link :to="{ name: 'shop_product', params: { id: item.product.id } }" class="link-dark" @click="showCartDrawer = false">
                      <p class="mb-1">{{ item.product.name }}</p>
                      <div class="fw-bold">{{ $n(parseFloat(item.product.get_price), 'currency') }}</div>
                      <div class="fs-light fs-6 mb-1 d-flex justify-content-start align-items-center gap-3">
                        <span>{{ item.size }}</span>
                        <span>{{ item.quantity }}x</span>
                      </div>
                    </router-link>

                    <v-btn class="me-2" size="x-small" variant="tonal" rounded @click="handleProductEdition('open', item)">
                      <font-awesome-icon :icon="['fas', 'pen']" />
                    </v-btn>

                    <v-btn variant="tonal" size="x-small" rounded>
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </v-btn>
                  </div>
                </div>
              </div>
            </article>

            <!-- <div class="d-flex justify-content-between align-items-center">
              <span>Total (TVA comprise)</span>
              <span class="fw-bold">{{ $n(cartTotal, 'currency') }}</span>
            </div> -->

            <v-btn v-if="authenticationStore.isAuthenticated" :to="{ name: 'shop_payment_home' }" color="primary" block>
              Passer commande
            </v-btn>

            <v-btn v-else color="primary" block @click="showCartDrawer = false, authenticationStore.showLoginDrawer = true">
              Passer commande
            </v-btn>
          </div>

          <div v-else class="col-12 h-100">
            <div class="d-flex flex-column justify-content-center text-center my-3">
              <font-awesome-icon :icon="['fas', 'shopping-bag']" size="7x" class="mb-5 text-dark" />
              <h3 class="h5 mb-3">Panier vide</h3>
              <p class="fw-light">Ton panier est encore vide, découvre tout ce que nous avons pour toi</p>
              <a href class="btn btn-block btn-primary btn-rounded btn-lg shadow-none" @click.prevent="handleCartButtonRedirection">
                Découvrir
              </a>
            </div>
          </div>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- Edit Product -->
    <v-navigation-drawer id="dialog-edit-product" v-model="showEditProductDrawer" location="right" width="400" temporary>
      <v-toolbar class="border-bottom" color="white">
        <v-btn variant="text" rounded @click="handleProductEdition('close')">
          <font-awesome-icon :icon="['fas', 'angle-left']" />
        </v-btn>

        <v-toolbar-title>Modifier</v-toolbar-title>
      </v-toolbar>

      <div class="container my-5">
        <div class="row">
          <div class="col-12">
            <v-img :src="localImagePath('size-guide.jpg')" />
          </div>

          <div class="col-12">
            <div class="my-4">
              <p class="fw-bold mb-1">12,99 €</p>
              <p>Top bandeau maille milano froncé</p>
            </div>

            <div class="my-4">
              <p class="fw-bold">Couleur</p>
            </div>

            <div class="my-4">
              <p class="fw-bold">Taille</p>
              <div class="d-flex gap-2">
                <v-btn v-for="i in 3" :key="i" color="primary" rounded>XS</v-btn>
              </div>
            </div>

            <div class="my-4">
              <p class="fw-bold">Quantité</p>
              <v-text-field v-model="changedProduct.quantity" type="number" min="1" max="999" variant="outlined" style="width:50%;"></v-text-field>
            </div>

            <v-btn color="primary" block @click="handleProductEdition('close')">
              Enregistrer
            </v-btn>
          </div>
        </div>
      </div>
    </v-navigation-drawer>
  </section>
</template>

<script>
import _ from 'lodash'

import { ref } from 'vue'
import { defineAsyncComponent, computed } from 'vue'
import { whenever, useRefHistory } from '@vueuse/core'
import { storeToRefs, mapState } from 'pinia'
import { useShop } from 'src/stores/shop'
import { useCart } from 'src/stores/cart'
import { useAuthenticationComposable } from 'src/composables/authentication'
import { useAuthentication } from 'src/stores/authentication'
import { useUtilities } from 'src/composables/shop'
import { useMessages } from 'src/stores/messages'

import BaseMessages from 'src/components/BaseMessages.vue'
import BaseNavbar from 'src/components/BaseNavbar.vue'
import BaseFooter from 'src/components/BaseFooter.vue'
import BaseProductIterator from 'src/components/BaseProductIterator.vue'
import LoadingRecommendationsBlock from 'src/components/LoadingRecommendationsBlock.vue'

export default {
  name: 'ShopLayout',
  components: {
    AsyncRecommendationsBlock: defineAsyncComponent({
      loader: async () => import('src/components/RecommendationsBlock.vue'),
      delay: 3000
    }),
    BaseProductIterator,
    BaseMessages,
    BaseNavbar,
    BaseFooter,
    LoadingRecommendationsBlock
  },
  setup () {
    const messagesStore = useMessages()
    const { messageItems } = storeToRefs(messagesStore)

    const { parseMainImage, localImagePath } = useUtilities()
    const { email, password, login } = useAuthenticationComposable()

    const shopStore = useShop()
    const authenticationStore = useAuthentication()

    const cartStore = useCart()
    const { showCartDrawer, showAddedProductDrawer, showEditProductDrawer } = storeToRefs(cartStore)

    const showSearchModal = ref(false)
    const search = ref(null)
    const searchedProducts = ref([])
    const canShowSearch = computed(() => {
      return searchedProducts.value.length > 0
    })
    const currentEditedProduct = ref({})

    const { history } = useRefHistory(search)

    const changedProduct = ref({
      quantity: 1
    })

    whenever(canShowSearch, () => {
      canShowSearch.value = true
    })

    return {
      login,
      email,
      password,
      shopStore,
      cartStore,
      currentEditedProduct,
      canShowSearch,
      localImagePath,
      parseMainImage,
      changedProduct,
      authenticationStore,
      showAddedProductDrawer,
      showEditProductDrawer,
      showCartDrawer,
      search,
      searchHistory: history,
      messageItems,
      searchedProducts,
      showSearchModal
    }
  },
  computed: {
    ...mapState(useCart, ['cartTotal']),
  },
  created () {
    this.cartStore.loadFromCache()
  },
  methods: {
    /**
     * Proxy that handles the main login process
     * to the backend
     */
    async handleLogin () {
      this.login(() => {
        this.authenticationStore.showLoginDrawer = false
        
        if (!this.$session.keyExists('authenticated_cart')) {
          // When the user logs, we know from the start that the
          // items in the cart were not authenticated
          this.$session.create('authenticated_cart', false)
        }
        this.handleAuthenticateCart()
      })
    },
    /**
     * When the user has added a set of products to his
     * cart when he was not logged in, this function will
     * get called in order to attribute all the products
     * to his authenticated account once he logs in  
     */
    async handleAuthenticateCart () {
      try {
        if (!this.$session.retrieve('authenticated_cart')) {
          await this.$http.post('cart/authenticate', {
            session_id: this.$session.retrieve('session_id')
          })
          this.$session.toggle('authenticated_cart')
        }
      } catch (e) {
        console.log(e)
      }
    },
    /**
     * Allows the user to search for products
     */
    searchProducts: _.debounce(async function () {
      try {
        if (this.search && this.search !== "") {
          const response = await this.$http.get('shop/search', {
            params: {
              q: this.search
            }
          })
          this.searchedProducts = response.data
        }
      } catch (e) {
        console.log(e)
      }
    }, 1000),
    /**
     * Handles the situation where the user tries
     * to go to the cart but is not logged in. If
     * he tries to access the cart while anonymous,
     * he is invited to login before pursuing
     */
    handleNotAuthenticatedOrdering () {
      if (this.authenticationStore.isAuthenticated) {
        this.showAddedProductDrawer = false
        this.$router.push({ name: 'shop_payment_home' })
      } else {
        this.cartStore.showCartDrawer = false
        this.cartStore.showAddedProductDrawer = false
        this.authenticationStore.showLoginDrawer = true
      }
    },
    /**
     * Handles the redirection to the correct page
     * if the user clicks on the discover button
     * in the cart modal
     */
    handleCartButtonRedirection () {
      this.cartStore.showCartDrawer = false
      this.$router.push({ 
        name: 'shop_products_collection', 
        params: {
          id: 'novelties'
        }
      })
    },
    /**
     * Handle the opening or the closing of 
     * the product edition dialog by ensuring
     * that cartDrawer is closed
     * 
     * @param {String} action
     * @param {{}} [product={}] 
     */
    handleProductEdition (action, product = {}) {
      this.currentEditedProduct = product
      switch (action) {
        case 'open':
          this.showCartDrawer = false
          this.showEditProductDrawer = true
          break
        
        case 'close':
          this.showEditProductDrawer = false
          this.showCartDrawer = true
          break
      
        default:
          break
      }
    }
  }
}
</script>

<style scoped>
#shop {
  position: relative;
  margin-top: 2rem;
}

.products-wrapper {
  height: 400px;
  overflow-y: scroll;
}

.products-wrapper::-webkit-scrollbar {
  display: none;
}
</style>
