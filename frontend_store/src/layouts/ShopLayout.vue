<template>
  <section id="shop">
    <!-- Nav -->
    <base-navbar @display-search="showSearchModal = true" />

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
                <v-text-field v-model="requestData.search" type="Search" placeholder="Ecris les produits à rechercher" variant="outlined">
                  <template #prepend>
                    <v-icon name="search"></v-icon>
                  </template>
                </v-text-field>
              </div>

              <!-- TODO: Make this a component: ProductsRecommentation.vue -->
              <h2 class="h4 text-center">Cela peut t'intéresser</h2>
              <div class="row products-wrapper">
                <div v-for="searchedProduct in searchedProducts" :key="searchedProduct" class="col-3">
                  <product-card :product="searchedProduct" />
                </div>
              </div>
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
                <img src="../assets/img8.jpeg" class="img-fluid" alt="">
              </div>

              <div class="col-8">
                <p class="fw-bold mb-1">34,34€</p>
                <p class="mb-2">Une mini-jupe de genre</p>
                <p class="text-body-secondary">Taille: M</p>
              </div>
            </div>

            <div class="row my-3">
              <div class="col-12">
                <v-btn color="primary" block @click="handleNotAuthenticatedOrdering">
                  Passer commande
                </v-btn>

                <v-btn class="mt-2" variant="text" block @click="showAddedProductDrawer = false, showAddedProductDrawer = false, showCartDrawer = true">
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
        <v-toolbar-title class="fw-bold">Panier ({{ cartStore.cart.length }})</v-toolbar-title>

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

          <div v-if="cartStore.hasProducts" class="col-12">
            <article v-for="product in cartStore.cart" :key="product.id" class="card shadow-none border" aria-label="">
              <div class="card-body p-2">
                <div class="d-flex justify-content-between gap-2">
                  <router-link :to="{ name: 'shop_product', params: { id: product.id } }" @click="showCartDrawer = false">
                    <img src="../assets/img9.jpeg" class="img-fluid" width="90" alt="">
                  </router-link>

                  <div class="infos">
                    <div class="fw-bold">{{ $n(product.product.price, 'currency') }}</div>
                    <p>{{ product.product.name }}</p>

                    <v-btn class="me-2" variant="tonal" rounded @click="showCartDrawer = false, showEditProductDrawer = true">
                      <font-awesome-icon :icon="['fas', 'pen']" />
                    </v-btn>

                    <v-btn variant="tonal" rounded>
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </v-btn>
                  </div>
                </div>
              </div>
            </article>

            <div class="d-flex justify-content-between align-items-center">
              <span>Total (TVA comprise)</span>
              <span class="fw-bold">{{ $n(cartTotal, 'currency') }}</span>
            </div>

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
        <v-btn variant="text" rounded @click="showEditProductDrawer = false, showCartDrawer = true">
          <font-awesome-icon :icon="['fas', 'angle-left']" />
        </v-btn>

        <v-toolbar-title>Modifier</v-toolbar-title>
      </v-toolbar>

      <div class="container my-5">
        <div class="row">
          <div class="col-12">
            <img src="../assets/img8.jpeg" class="img-fluid" alt="">
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

            <v-btn color="primary" block @click="handleProductEdition">Enregistrer</v-btn>
          </div>
        </div>
      </div>
    </v-navigation-drawer>
  </section>
</template>

<script>
import { ref } from 'vue'
import { storeToRefs, mapState } from 'pinia'
import { useShop } from 'src/stores/shop'
import { useCart } from 'src/stores/cart'
import { useAuthenticationComposable } from 'composables/authentication'
import { useAuthentication } from 'stores/authentication'

import BaseNavbar from 'components/BaseNavbar.vue'
import BaseFooter from 'components/BaseFooter.vue'
import ProductCard from 'components/products/ProductCard.vue'

export default {
  name: 'ShopLayout',
  components: {
    BaseNavbar,
    BaseFooter,
    ProductCard
  },
  setup () {
    const { email, password, login } = useAuthenticationComposable()

    const shopStore = useShop()
    const authenticationStore = useAuthentication()

    const cartStore = useCart()
    const { showCartDrawer, showAddedProductDrawer, showEditProductDrawer } = storeToRefs(cartStore)

    const showSearchModal = ref(false)
    const requestData = ref({ search: null })
    const searchedProducts = ref(Array.from({ length: 20 }, (k, v) => v + 1))

    const changedProduct = ref({
      quantity: 1
    })

    return {
      login,
      email,
      password,
      shopStore,
      cartStore,
      changedProduct,
      authenticationStore,
      showAddedProductDrawer,
      showEditProductDrawer,
      showCartDrawer,
      requestData,
      searchedProducts,
      showSearchModal
    }
  },
  computed: {
    ...mapState(useCart, ['cartTotal']),
  },
  created () {
    // Preload the cart from the session if we actually
    // have the data. This allows us then to dynamically
    // calculate the items that the user has selected
    this.cartStore.cart = this.sessionStorage?.cart || []
  },
  methods: {
    async handleLogin () {
      this.login(() => {
        this.authenticationStore.showLoginDrawer = false
      })
    },
    handleNotAuthenticatedOrdering () {
      // Handles the situation where the user tries
      // to go to the cart but is not logged in
      if (this.authenticationStore.isAuthenticated) {
        this.showAddedProductDrawer = false
        this.$route.push({ name: 'shop_payment_home' })
      } else {
        this.cartStore.showCartDrawer = false
        this.cartStore.showAddedProductDrawer = false
        this.authenticationStore.showLoginDrawer = true
      }
    },
    handleCartButtonRedirection () {
      // Handle the redirection the correct page
      // if the user clicks on the discover button
      // on the cart button
      this.cartStore.showCartDrawer = false
      this.$router.push({ 
        name: 'shop_products_collection', 
        params: {
          id: 'new'
        }
      })
    },
    handleProductEdition () {
      this.showEditProductDrawer = false
      this.showCartDrawer = true
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
