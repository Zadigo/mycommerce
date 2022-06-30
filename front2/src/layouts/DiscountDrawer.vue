<template>
  <div ref="link" :class="{ active: opened }" class="drawer">
    <div class="action-button d-flex justify-content-center" @click="opened = !opened">
      <font-awesome-icon v-if="opened" icon="fa-solid fa-circle-arrow-right" class="mb-3" />
      <font-awesome-icon v-else icon="fa-solid fa-circle-arrow-left" class="mb-3" />
      <h4 class="fw-bold m-0">
        {{ $t('Get discount', { value: $n(3, 'currency', $i18n.locale) }) }}
      </h4>
    </div>
    <div class="wrapper">
      Some wrapper
    </div>
  </div>
</template>

<script>
export default {
  name: 'DiscountDrawr',
  data: () => ({
    opened: false
  })
}
</script>

<style scoped>
.drawer {
  position: fixed;
  transition: all .3s ease;
  right: 0;
  top: 30%;
  bottom: 50%;
  width: 600px;
  height: auto;
  display: flex;
  justify-content: space-between;
  transform: translateX(calc(600px - 44px));
  z-index: 1000;
}

@media (min-width: 360px) {
  .drawer {
    width: 300px;
    transform: translateX(calc(300px - 44px));
  }
}

.drawer.active {
  transform: translateX(0px);
}

.action-button {
  width: 44px;
  background-color: rgba(0, 0, 0, 1);
  cursor: pointer;
  padding: .5rem;
  color: white;
  height: 300px;
  font-weight: 500;
  writing-mode: vertical-lr;
  text-orientation: sideways-right;
  text-align: center;
  vertical-align: middle;
}

.active-button:hover {
  animation: scale .3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

@keyframes scale {
  0% {
    transform: scale(1.1, 1.1);
  }

  99% {
    transform: scale(1, 1);
  }
}

.wrapper {
  width: 100%;
  height: 300px;
  background-color: #eee;
  padding: 1rem;
}
</style>
