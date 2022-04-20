<template>
  <section id="fitting-room">
    <div class="left">
      <img :src="require('@/assets/fitting_room.jpg')" />
    </div>

    <div class="right text-center">
      <component :is="current" @go-to-next="cursor = cursor + 1" />
    </div>
  </section>
</template>

<script>
import HomeComponent from '@/components/shop/fitting_room/HomeComponent.vue'
import FidelityComponent from '@/components/shop/fitting_room/FidelityComponent.vue'

export default {
    name: 'FittingRoomView',
    components: {
      HomeComponent,
      FidelityComponent
    },
    data: () => ({
      cursor: 0,
      componentNames: [
        'home-component',
        'fidelity-component'
      ]
    }),
    computed: {
      current() {
        return this.componentNames[this.cursor]
      }
    }
}
</script>

<style scoped>
section {
  /* background-color: black; */
  height: 100vh;
  width: 100%;
}
#fitting-room {
  display: flex;
  flex-direction: row;
  gap: 40px;
  overflow: hidden;
}
.right {
  width: 50%;
  height: 100%;
  padding: 2rem;
}
.left {
  position: relative;
  width: 50%;
  height: 100%;
  overflow: hidden;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  transition-property: background-image;
}

.left img {
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
}
</style>
