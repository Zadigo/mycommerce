<template>
  <div class="dropdown-menu megamenu" role="menu">
    <div class="row g-3">
      <div class="col-lg-3 col-6">
        <div class="col-megamenu">
          <h6 class="title text-uppercase">Title Menu One</h6>
          <ul class="list-unstyled">
            <li><a href="#">Custom Menu</a></li>
            <li><a href="#">Custom Menu</a></li>
            <li><a href="#">Custom Menu</a></li>
            <li><a href="#">Custom Menu</a></li>
            <li><a href="#">Custom Menu</a></li>
            <li><a href="#">Custom Menu</a></li>
          </ul>
        </div>
      </div>
      
      <div class="col-lg-3 col-6">
        <div class="col-megamenu">
          <h6 class="title text-uppercase">A la une</h6>
          <ul class="list-unstyled">
            <li><router-link :to="{ name: 'home' }">Nouveautés</router-link></li>
            <li><a href="#">Custom Menu</a></li>
            <li><a href="#">Custom Menu</a></li>
            <li><a href="#">Custom Menu</a></li>
            <li><a href="#">Custom Menu</a></li>
            <li><a href="#">Custom Menu</a></li>
          </ul>
        </div>  <!-- col-megamenu.// -->
      </div><!-- end col-3 -->

      <div class="col-lg-3 col-6">
        <div class="col-megamenu">
          <h6 class="title text-uppercase">Sous vêtements</h6>
          <ul class="list-unstyled">
            <li><a href="#">Custom Menu</a></li>
            <li><a href="#">Custom Menu</a></li>
            <li><a href="#">Custom Menu</a></li>
            <li><a href="#">Custom Menu</a></li>
            <li><a href="#">Custom Menu</a></li>
            <li><a href="#">Custom Menu</a></li>
          </ul>
        </div>  <!-- col-megamenu.// -->
      </div>

      <div class="col-lg-3 col-6">
        <div class="col-megamenu">
          <v-img src="http://via.placeholder.com/800x800"></v-img>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseMenu'
}
</script>

<style scoped>
  @media (min-width: 992px) {
  .navbar-expand-lg .navbar-nav .dropdown-menu {
      position: absolute;
    }
  }

  @media (min-width: 992px) {
    .navbar .megamenu {
      left: 0;
      right: 0;
      width: 100%;
      margin-top: 0;
    }
  }

  .navbar .megamenu {
    padding: 4rem;
  }

  .dropdown-menu.show {
    display: block;
  }
</style>
