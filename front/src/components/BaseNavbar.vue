<template>
  <b-navbar v-if="!$route.meta.fullPage" toggleable="lg" type="light" variant="white" class="mb-0">
    <b-container>
      <b-navbar-brand :to="{ name: 'home', params: { lang: $i18n.locale } }" class="fs-22">
        <span class="text-uppercase font-weight-bold">
          {{ myproject.company.legalName }}
        </span>
      </b-navbar-brand>


      <b-collapse id="nav-collapse" is-nav>

        <b-navbar-nav>
          <b-nav-item :to="{ name: 'collection_details', params: { collection: 'all', lang: $i18n.locale } }" class="text-uppercase">
            {{ $t('Shop') }}
          </b-nav-item>

          <b-nav-item :to="{ name: 'collection_details', params: { collection: 'lingerie', lang: $i18n.locale } }" class="text-uppercase">
            {{ $t('Skirts') }}
          </b-nav-item>

          <b-nav-item :to="{ name: 'dashboard_index' }" class="text-uppercase">
            Admin
          </b-nav-item>
        </b-navbar-nav>

        <form class="form-inline">
          <v-text-field type="search" outlined hide-details></v-text-field>
        </form>
        
        <b-navbar-nav class="ml-auto">
          <!-- <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form> -->

          <!-- <v-menu :close-on-content-click="true" :open-on-hover="false" :rounded="false" transition="slide-transition" :offset-y="true">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" text>
                <v-icon size="28" class="font-weight-bold">mdi-account</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item v-if="isAuthenticated" :to="{ name: 'account_home' }">
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>

              <v-list-item v-if="!isAuthenticated" :to="{ name: 'login' }">
                <v-list-item-title>Login</v-list-item-title>
              </v-list-item>

              <v-list-item v-if="!isAuthenticated" :to="{ name: 'login' }">
                <v-list-item-title>Signup</v-list-item-title>
              </v-list-item>

              <v-list-item v-if="isAuthenticated" @click="logout">
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu> -->
          
          <!-- TODO: Open this menu programatically -->
          <!-- <b-nav-item>
            <span v-e-menu:megamenu>Something</span>
            <base-menu />
          </b-nav-item> -->

          <b-nav-item :to="{ name: 'wishlist', params: { lang: $i18n.locale } }">
            <v-icon size="28" class="mr-2">mdi-heart</v-icon>
          </b-nav-item>
          
          <b-nav-item @click="$store.commit('toggleModalCart')">
            <!-- <span class="badge red z-depth-1 mr-1"> {{ cartCount }} </span> -->
            <!-- <font-awesome-icon icon="shopping-cart" class="mr-2" /> -->
            <v-icon size="28" class="mr-2">mdi-cart</v-icon>
          </b-nav-item>        
        </b-navbar-nav>

      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import { mapGetters } from 'vuex'

// import BaseMenu from '../components/BaseMenu.vue'

export default {
  name: 'BaseNavbar',

  // components: { BaseMenu },
  
  computed: {
    ...mapGetters(['cartCount']),
    ...mapGetters('authenticationModule', ['isAuthenticated'])
  },

  methods: {
    logout() {
      this.$store.commit('authenticationModule/logout')
      this.$router.push({ name: 'home', params: { lang: this.$i18n.locale } })
    }
  }
}
</script>
