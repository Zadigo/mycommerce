<template>
  <header>
    <side-bar />

    <nav id="main-navbar" class="navbar navbar-expand-lg navbar-light bg-white fixed-top" >
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-mdb-toggle="collapse" data-mdb-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation" >
          <i class="fas fa-bars"></i>
        </button>

        <!-- Brand -->
        <router-link :to="{ name: 'dashboard_index_view' }" class="navbar-brand">
          <img src="https://mdbootstrap.com/img/logo/mdb-transaprent-noshadows.png" height="25" alt="" loading="lazy" />
        </router-link>

        <!-- Search form -->
        <form class="d-none d-md-flex input-group w-auto my-auto">
          <input autocomplete="off" type="search" class="form-control rounded" placeholder='Search (ctrl + "/" to focus)' style="min-width: 225px" />
          <span class="input-group-text border-0">
            <!-- <v-icon class="mr-2">mdi-magnify</v-icon> -->
          </span>
        </form>

        <!-- Right -->
        <ul class="navbar-nav ms-auto d-flex flex-row">
          <!-- Notifications -->
          <li class="nav-item dropdown">
            <a class="nav-link me-3 me-lg-0 dropdown-toggle hidden-arrow" href="#"  role="button" aria-expanded="false">
              <!-- <v-icon class="mr-2">mdi-bell</v-icon> -->
              <span class="badge rounded-pill badge-notification bg-danger">1</span>
            </a>

            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#">Some news</a></li>
              <li><a class="dropdown-item" href="#">Another news</a></li>
              <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
          </li>

          <!-- Icon -->
          <li class="nav-item">
            <a class="nav-link me-3 me-lg-0" href="#">
              <i class="fas fa-fill-drip"></i>
            </a>
          </li>
          <!-- Icon -->
          <li class="nav-item me-3 me-lg-0">
            <a class="nav-link" href="#">
              <i class="fab fa-github"></i>
            </a>
          </li>

          <li class="nav-item me-3 me-lg-0">
            <a class="nav-link" @click="goToSite">
              Go to website
            </a>
          </li>

          <!-- Avatar -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle hidden-arrow d-flex align-items-center" href="#" id="navbarDropdownMenuLink" role="button" aria-expanded="false" >
              <img src="https://mdbootstrap.com/img/Photos/Avatars/img (31).jpg" class="rounded-circle" height="22" alt="some user" loading="lazy" />
            </a>

            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink" >
              <li><a class="dropdown-item" href="#">My profile</a></li>
              <li><a class="dropdown-item" href="#">Settings</a></li>
              <li><a class="dropdown-item" href="#">Logout</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { useDashboard } from '@/store/dashboard'
import SideBar from './SideBar.vue'

export default {
  name: 'TopHeader',
  components: {
    SideBar
  },
  setup() {
    var store = useDashboard()
    return {
      store
    }
  },
  methods: {
    goToSite() {
      this.store.changeSite('base-site')
      this.$router.push({ name: 'shop_view', params: { lang: 'fr' } })
    },

    openMenu(e) {
      console.log(e)
      // el.classList.add('show')
    },
    closeMenu(e) {
      console.log(e)
      // el.classList.remove('show')
    }
  }
}
</script>
