<template>
  <volt-drawer id="dialog-edit-product" v-model:visible="showEditProductDrawer" :block-scroll="true" position="right">
    <div v-if="editedCartItem">
      <volt-button class="mb-2" @click="closeAllModals(({ cart }) => { cart.value = true })">
        <icon name="i-fa7-solid:angle-left" />
      </volt-button>

      <h2 class="font-bold">{{ $t('Modifier') }}</h2>

      <div>
        <nuxt-img :src="editedCartItem.product.mainImage.original" :alt="editedCartItem.product.name" />

        <div class="my-4">
          <p class="font-bold mb-1">
            {{ editedCartItem.product.price }}
          </p>
          <p>
            {{ editedCartItem.product.name }}
          </p>
        </div>

        <div class="my-4">
          <p class="font-bold">
            {{ $t('Couleur') }}
          </p>
          <!-- <p>
            {{ editedCartItem.product.variant.name }}
          </p> -->
        </div>

        <div class="my-4">
          <p class="font-bold">
            {{ $t('Taille') }}
          </p>

          <div class="flex gap-2">
            <!-- <product-size-button v-for="size in editedCartItem.product.sizesSet" :key="size.id" :size="size" @select-size="handleSizeSelection" /> -->
          </div>
        </div>

        <div class="my-4">
          <p class="font-bold">
            {{ $t('Quantité') }}
          </p>

          <volt-input-number v-model="editedCartItem.quantity" :min="1" :max="999" class="w-[2/4]" />
        </div>

        <volt-button class="w-full" @click="closeAllModals(({ cart }) => { cart.value = true })">
          {{ $t('Enregistrer') }}
        </volt-button>
      </div>
    </div>

    <div v-else>
      <modals-skeleton-loader class="mt-4" />
    </div>
  </volt-drawer>
</template>

<script setup lang="ts">
/**
 * Edition
 */

const { editedCartItem } = useEditCartItemComposable()

const showEditProductDrawer = useState<boolean>('showEditProductDrawer')

const { closeAllModals, toggleShowEditProductDrawer } = useModalsState()
</script>
