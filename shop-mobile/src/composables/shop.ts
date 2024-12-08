import { client } from "@/plugins/axios";
import { useVueLocalStorage } from "@/plugins/vue-storages";
import { useShop } from "@/stores/shop";
import { APIResponse, Product, ProductCollection } from "@/types/shop";
import { useIonRouter } from "@ionic/vue";
import { storeToRefs } from "pinia";
import { getCurrentInstance, ref } from "vue";


/**
 * A composable that implements default
 * resusable functions for the shop, such
 * as liking a product or adding it to
 * the user cart
 */
export function useShopComposable() {
  const isLiked = ref(false);
  
  const router = useIonRouter();
  
  const shopStore = useShop();
  const { 
    currentProduct, 
    currentCollection, 
    currentCollectionName 
  } = storeToRefs(shopStore);

  const recommendedProducts = ref<Product[]>([])

  const { instance } = useVueLocalStorage()
  const app = getCurrentInstance()

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
  async function handleLike(product: Product) {
    isLiked.value = !isLiked.value;

    if (isLiked.value) {
      shopStore.addToWishlist(product.id);
    } else {
      shopStore.removeFromWishlist(product.id);
    }
  }

  /**
   * See the details for the current given collection
   * in the collection's page
   */
  function handleGoToProduct(product: Product) {
    currentProduct.value = product;
    router.push("/tabs/tab1/product");
  }

  /**
   * See the details for the current given collection
   * in the collection's page
   */
  function handleGoToCollection(collection: ProductCollection) {
    currentCollection.value = collection;
    currentCollectionName.value = collection.name;
    router.push("/tabs/tab1/products");
  }

  /**
   * See the details for the current given collection
   * in the collection's page
   */
  function handleGoToCollectionByName(name: string) {
    try {
      currentCollectionName.value = name;
      router.push("/tabs/tab1/products");
    } catch (e) {
      console.log(e);
    }
  }

  async function handleGetRecommendations(quantity: number = 3) {
    const response = await client.get("/shop/products/recommendations", {
      params: { m: 1, q: quantity, i: 1 },
    });
    recommendedProducts.value = response.data;
  }

  async function requestProductsFromCollection(callback: (data: APIResponse) => void): Promise<APIResponse> {
    try {
      const collectionUrlPath = `collection/${currentCollectionName.value.toLowerCase()}`;

      if (instance.keyExists(collectionUrlPath)) {
        callback.call(app, instance.retrieve(collectionUrlPath));
      } else {
        const response = await client.get<APIResponse>(collectionUrlPath);
        instance.create(collectionUrlPath, response.data);
        instance.create("products", response.data.results);
        callback.call(app, response.data)
      }
    } catch (e) {
      console.log(e);
      // If we fail to get the collectionName
      // redirect to the 404 page
      // messagesStore.addNetworkError()

      // if (e.response.status === 404) {
      //   router.push({ name: 'not_found' })
      // }
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
