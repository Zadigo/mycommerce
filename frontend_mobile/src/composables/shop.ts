import { useAxiosClient } from "@/plugins/client";
import { useShop } from "@/stores/shop";
import { Product, ProductCollection, ProductsAPIResponse } from "@/types";
import { useIonRouter } from "@ionic/vue";
import { storeToRefs } from "pinia";
import { getCurrentInstance, ref } from "vue";
import { useListManager } from "./utils";


/**
 * A composable that implements default
 * resusable functions for the shop, such
 * as liking a product or adding it to
 * the user cart
 */
export function useShopComposable() {
  const { client } = useAxiosClient()
  
  const app = getCurrentInstance()
  const router = useIonRouter();
  
  const shopStore = useShop();
  const { currentProduct, currentCollection, currentCollectionName } = storeToRefs(shopStore);
  
  const isLiked = ref(false);
  const recommendedProducts = ref<Product[]>([])


  /**
   * Function that manages products that were
   * liked locally (local storage) and in the
   * shop store
   *
   * @param {Object} product The product to like
   * @param {number} product.id The product ID
   */
  async function handleAnonymousLike(product: Product) {
    product;
  }

  /**
   * Function that manages products that were
   * liked by sending the requests to the backend
   * as required
   *
   * @param {Object} product The product to like
   * @param {number} product.id The product ID
   */
  async function handleAuthenticatedLike(product: Product) {
    product;
  }

  /**
   * Main entry function for managing the user liked
   * products either locally or in the backend.
   * Handles the action of liking a product
   * and therefore adding it to the user's
   * wishlist
   */
  function handleLike(items: number[], product: Product | null | undefined): (boolean | number[])[] {
    if (product) {
      const { save, managedList } = useListManager()
      const state = save(items, product.id)
      return [state, managedList.value]
    } else {
      return []
    }
  }

  /**
   * See the details for the current given collection
   * in the collection's page
   */
  function handleGoToProduct(product: Product) {
    currentProduct.value = product;
    router.push('/tabs/tab1/product');
  }

  /**
   * See the details for the current given collection
   * in the collection's page
   */
  function handleGoToCollection(collection: ProductCollection) {
    currentCollection.value = collection;
    currentCollectionName.value = collection.name;
    // TODO: Does not work everytime
    router.push('/tabs/tab1/products');
  }

  /**
   * See the details for the current given collection
   * in the collection's page
   */
  function handleGoToCollectionByName(name: string) {
    currentCollectionName.value = name;
    router.push('/tabs/tab1/products');
    // try {
    // } catch (e) {
    //   console.log(e);
    // }
  }

  async function handleGetRecommendations(quantity: number = 3) {
    const response = await client.get("/shop/products/recommendations", {
      params: { m: 1, q: quantity, i: 1 },
    });
    recommendedProducts.value = response.data;
  }

  async function requestProductsFromCollection(callback: (data: ProductsAPIResponse) => void) {
    try {
      let collectionUrlPath

      if (currentCollectionName.value) {
        collectionUrlPath = `collection/${currentCollectionName.value.toLowerCase()}`;
      } else {
        collectionUrlPath = 'collection/all'
      }

      const response = await client.get<ProductsAPIResponse>(collectionUrlPath);
      console.log('requestProductsFromCollection', response.data)
      callback.call(app, response.data)
      
      // const collectionUrlPath = `collection/${currentCollectionName.value.toLowerCase()}`;

      // if (instance.keyExists(collectionUrlPath)) {
      //   callback.call(app, instance.retrieve(collectionUrlPath));
      // } else {
      //   const response = await client.get<ProductsAPIResponse>(collectionUrlPath);
      //   instance.create(collectionUrlPath, response.data);
      //   instance.create("products", response.data.results);
      //   callback.call(app, response.data)
      // }
    } catch (e) {
      console.log(e);
    }
  }

  return {
    isLiked,
    recommendedProducts,
    requestProductsFromCollection,
    handleLike,
    handleAnonymousLike,
    handleAuthenticatedLike,
    handleGoToProduct,
    handleGoToCollection,
    handleGetRecommendations,
    handleGoToCollectionByName,
  };
}
