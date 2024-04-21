<template>
  <section id="accounts">
    <base-navbar @display-search="() => {}" />

    <div class="container mb-5" style="margin-top: 6rem;">
      <div class="row">
        <div class="col-sm-12 col-md-10 offset-md-2">
          <div class="row">
            <div class="col-4">
              <div class="card shadow-sm">
                <div class="card-body">
                  <div class="list-group">
                    <router-link v-for="link in links" :key="link.to" :to="{ name: link.to }" class="list-group-item">
                      {{ link.name }}
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
      
            <div class="col-6">
              <router-view></router-view>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import BaseNavbar from 'components/BaseNavbar.vue'

const links = [
  {
    name: 'User',
    to: 'accounts_home'
  },
  {
    name: 'Orders',
    to: 'accounts_orders'
  }
]

export default {
  components: {
    BaseNavbar
  },
  setup () {
    return {
      links
    }
  }
}
</script>
