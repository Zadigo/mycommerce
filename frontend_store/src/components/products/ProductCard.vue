<template>
  <article :aria-label="product.name" class="card shadow-none rounded-0" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <router-link :to="{ name: 'shop_product', params: { id: product.id } }" class="link-dark">
      <img src="../../assets/img10.jpeg" class="card-img-top rounded-0" alt="">
    </router-link>

    <div v-if="isHovered" class="card-cover p-4">
      <div class="row text-center">
        <div class="col-12">
          <div v-if="requiresSizeItems" class="size-items">
            <p class="fw-bold">Sélectionne la taille</p>
            <div class="d-flex justify-content-around flex-wrap gap-1">
              <!-- <v-btn v-for="size in product.sizes" :key="size.id" variant="tonal" rounded>
                {{ size.name }}
              </v-btn> -->
              <base-size-button v-for="size in product.sizes" :key="size.id" :size="size" @update:selected-size="handleSelectedSize" />
            </div>
          </div>

          <v-btn v-else variant="text" block rounded>
            {{ $t('Ajouter au panier') }}
          </v-btn>
        </div>
      </div>
    </div>
    <!-- <transition name="card-cover">
    </transition> -->

    <button v-if="showLikeButton" id="btn-like-product" type="button" class="btn btn-light btn-floating" aria-label="Like product" @click="handleLike(product)">
      <font-awesome-icon v-if="isLiked" :icon="['fas', 'heart']" />
      <font-awesome-icon v-else :icon="['far', 'heart']" />
    </button>

    <router-link :to="{ name: 'shop_product', params: { id: product.id } }" class="link-dark">
      <div class="card-body pt-0 px-0 pb-0">
        <p class="mb-0 mt-1 fw-light" :aria-label="product.name">{{ product.name }}</p>
        <!-- <p class="fw-bold">{{ $n(product.get_price, 'currency') }}</p> -->
        <p class="fw-bold">{{ product.get_price }}</p>
      </div>
    </router-link>
  </article>
</template>

<script>
import { ref } from 'vue'
import { useShopComposable } from 'composables/shop'

import BaseSizeButton from '../BaseSizeButton.vue'

export default {
  name: 'ProductCard',
  components: {
    BaseSizeButton
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    showLikeButton: {
      type: Boolean,
      default: true
    }
  },
  setup () {
    const { isLiked, handleLike } = useShopComposable()
    const isHovered = ref(false)

    return {
      isLiked,
      isHovered,
      handleLike
    }
  },
  computed: {
    requiresSizeItems () {
      return this.product.sizes.length > 0
    }
  },
  methods: {
    imageOrPlaceholder (image) {
      return image || 'https://placehold.co/280x400'
    },
    handleSelectedSize (size) {
      console.log(size)
    }
  }
}
</script>

<style scoped>
  #btn-like-product {
    position: absolute;
    top: 5%;
    right: 5%;
  }

  .card-cover {
    position: absolute;
    bottom: 20%;
    left: 2%;
    right: 2%;
    height: auto;
    width: 96%;
    background-color: white;
  }

  .card-cover-enter-active,
  .card-cover-leave-active {
    transition: all .3s ease-in;
  }

  .card-cover-enter-to,
  .card-cover-leave-from {
    opacity: 0;
    /* transform: translateY(0%); */
  }

  .card-cover-enter-from,
  .card-cover-leave-to {
    opacity: 1;
    /* transform: translateY(20%); */
  }
</style>

