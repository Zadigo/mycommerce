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
              <h3 class="h5 flew-grow">{{ $t('Connecte-toi ou crée un compte') }}</h3>

              <v-btn variant="outlined" color="dark" size="x-large" class="mt-3 mb-5" rounded>
                Google
              </v-btn>

              <p class="fw-light">
                En me connectant avec mon identifiant social, j'accepte de lier mon 
                compte conformément à la Politique de confidentialité
              </p>

              <v-form id="form-login" @submit.prevent>
                <v-text-field v-model="email" :placeholder="$t('Email')" variant="outlined" type="email" autocomplete="email"></v-text-field>
                <v-text-field v-model="password" :placeholder="$t('Mot de passe')" variant="outlined" type="password" autocomplete="current-password"></v-text-field>

                <v-btn class="text-light" color="dark" size="x-large" block flat rounded @click="handleLogin">{{ $t('Se connecter') }}</v-btn>
              </v-form>

              <p class="flex-grow text-center fw-light mt-3">
                {{ $t('No account signup text') }}
              </p>
            </div>
          </div>
        </div>
      </v-container>
    </v-navigation-drawer>

    <!-- Search -->
    <v-dialog id="dialog-search" v-model="showSearchModal" transition="dialog-bottom-transition" fullscreen>
      <v-card>
        <v-toolbar>
          <v-toolbar-title class="fw-bold text-uppercase">
            {{ companyDetails.name }}
          </v-toolbar-title>

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
              
              <div v-if="canShowSearch" class="row gx-1 gy-1">
                <base-product-iterator :products="searchedProducts" />
              </div>

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

    <!-- Confirmation Product Confirmation -->
    <v-navigation-drawer id="dialog-product-confirmation" v-model="showAddedProductDrawer" location="right" width="400" temporary>
      <div class="container">
        <div class="row my-3">
          <div v-if="cartStore.hasProducts" class="col-12">
            <div class="d-flex justify-content-start mb-5 fs-5 align-items-center gap-2">
              <font-awesome-icon :icon="['fas', 'circle-check']" class="text-success" />
              <span>{{ $t('Ajouté au panier') }}</span>
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
                  {{ $t('Passer commande') }}
                </v-btn>

                <v-btn class="mt-2" variant="text" block @click="showAddedProductDrawer = false, showCartDrawer = true">
                  {{ $t('Voir le panier') }}
                </v-btn>
              </div>
            </div>

            <!-- TODO: Iterate products -->
            <h4 class="text-center h5">{{ $t('Autres produits') }}</h4>
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
        <v-toolbar-title class="fw-bold">{{ $t('Cart quantity', { n: cartStore.numberOfProducts }) }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn :to="{ name: 'wishlist' }" rounded variant="outlined" @click="showCartDrawer = false">
          <font-awesome-icon :icon="['far', 'heart']" class="me-2" />
          {{ $t('Favoris') }}
        </v-btn>
      </v-toolbar>

      <div class="container mt-1">
        <div v-if="cartStore.hasProducts" class="row d-flex justify-content-between">
          <div class="col-12 mt-4">
            <div class="card shadow-sm">
              <div class="card-body">
                <p v-if="cartStore.freeDeliveryTarget > 0" class="fw-light">
                  {{ cartTotal }}
                  {{ $t('Livraison gratuite offerte', { n: $n(cartStore.freeDeliveryTarget, 'currency') }) }}
                  <!-- Il te manque 19,02 € pour profiter de la -->
                  <span class="fw-bold text-primary text-uppercase">
                    {{ $t('livraison standard gratuite') }}
                  </span>
                </p>

                <div v-else class="fw-light">
                  <p class="fw-bold text-success text-uppercase mb-1">
                    {{ $t('Livraison standard gratuite') }}
                  </p>

                  <p class="fw-light">
                    Tu vas pouvoir profiter de la livraison 
                    standard gratuite à domicile
                  </p>
                </div>
              </div>
            </div>
          </div>

          <base-cart-iterator class="my-2" @edit-product="handleProductEdition" />

          <div class="d-flex justify-content-between align-items-center py-4">
            <span class="fw-light">{{ $t('Total (TVA comprise)') }}</span>
            <span class="fw-bold">{{ $n(cartTotal, 'currency') }}</span>
          </div>
          
          <div class="col-12">
            <v-btn v-if="authenticationStore.isAuthenticated" :to="{ name: 'shop_payment_home' }" color="primary" block>
              {{ $t('Passer commande') }}
            </v-btn>

            <v-btn v-else color="primary" block @click="showCartDrawer = false, authenticationStore.showLoginDrawer = true">
              {{ $t('Passer commande') }}
            </v-btn>
          </div>
        </div>

        <div v-else class="col-12 mt-5 h-100">
          <div class="d-flex flex-column justify-content-center text-center my-3">
            <font-awesome-icon :icon="['fas', 'shopping-bag']" size="7x" class="mb-5 text-dark" />
            
            <h3 class="h5 mb-3">{{ $t('Panier vide') }}</h3>
            
            <p class="fw-light">
              {{ $t('Empty cart text') }}
            </p>
            
            <a href class="btn btn-block btn-primary btn-rounded btn-lg shadow-none" @click.prevent="handleCartButtonRedirection">
              {{ $t('Découvrir') }}
            </a>
          </div>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- Edit Product -->
    <v-navigation-drawer id="dialog-edit-product" v-model="showEditProductDrawer" location="right" width="400" temporary>
      <v-toolbar class="border-bottom" color="white">
        <v-btn variant="text" rounded @click="handleProductEdition({ action: 'close' })">
          <font-awesome-icon :icon="['fas', 'angle-left']" />
        </v-btn>

        <v-toolbar-title>{{ $t('Modifier') }}</v-toolbar-title>
      </v-toolbar>

      <div class="container my-5">
        <div class="row">
          <div class="col-12">
            <v-img :src="localImagePath('size-guide.jpg')" />
          </div>

          <div class="col-12">
            <div class="my-4">
              <p class="fw-bold mb-1">29.99€</p>
              <p>Product name</p>
            </div>

            <div class="my-4">
              <p class="fw-bold">{{ $t('Couleur') }}</p>
            </div>

            <div class="my-4">
              <p class="fw-bold">{{ $t('Taille') }}</p>
              <div class="d-flex gap-2">
                <v-btn v-for="i in 3" :key="i" color="primary" rounded>XS</v-btn>
              </div>
            </div>

            <div class="my-4">
              <p class="fw-bold">{{ $t('Quantité') }}</p>
              <v-text-field type="number" min="1" max="999" variant="outlined" style="width:50%;"></v-text-field>
            </div>

            <v-btn color="primary" block @click="handleProductEdition({ action: 'close' })">
              {{ $t('Enregistrer') }}
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
import { useCompany } from 'src/composables/company'

import BaseCartIterator from 'src/components/BaseCartIterator.vue'
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
    BaseCartIterator,
    BaseProductIterator,
    BaseMessages,
    BaseNavbar,
    BaseFooter,
    LoadingRecommendationsBlock
  },
  setup () {
    const { companyDetails } = useCompany()
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
      companyDetails,
      localImagePath,
      parseMainImage,
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
        console.error(e)
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
        console.error(e)
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
     * @param {String} action Open or close the drawer
     * @param {Object} product Product object to edit
     */
    handleProductEdition ({ action, product }) {
      console.info(action, product)
      this.currentEditedProduct = product || {}

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
