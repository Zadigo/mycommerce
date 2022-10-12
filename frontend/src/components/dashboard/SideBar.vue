<template>
  <keep-alive>
    <nav id="sidebarMenu" class="collapse d-lg-block sidebar collapse bg-white">
      <div class="position-sticky">
        <div class="list-group list-group-flush mx-3 mt-4">
          <router-link v-for="route in dashboardRoutes" :key="route.name" :to="{ name: route.name }" :aria-current="route.name === $route.name" class="list-group-item list-group-item-action py-2 ripple">
            <font-awesome-icon :icon="`fa-solid fa-${route.meta.icon}`" class="mr-2" />
            <span>{{ route.meta.text }}</span>
          </router-link>
        </div>
      </div>
    </nav>
  </keep-alive>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'SideBar',

  computed: {
    dashboardRoutes () {
      return _.filter(this.$router.getRoutes(), (route) => {
        return route.meta.adminLink
      })
    }
  }
}
</script>

<style scoped>
.list-group-item+.list-group-item.router-link-exact-active {
  margin-top: -1px;
  border-top-width: 1px;
}

.sidebar .router-link-exact-active,
.sidebar .detail-route {
  border-radius: 5px;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
}

.list-group-item.router-link-exact-active {
    z-index: 2;
    color: #fff;
    background-color: #1266f1;
    border-color: #1266f1;
}
</style>
