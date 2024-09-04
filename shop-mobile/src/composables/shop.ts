import { client } from "@/plugins/axios";
import { useShop } from "@/stores/shop";
import { Product, ProductCollection } from "@/types/shop";
import { useIonRouter } from "@ionic/vue";
import { isUndefined } from "lodash";
import { storeToRefs } from "pinia";
import { ref } from "vue";
// import { useI18n } from "vue-i18n";


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

  return {
    isLiked,
    recommendedProducts,
    handleLike,
    handleAnonymousLike,
    handleAuthenticatedLike,
    handleGoToProduct,
    handleGoToCollection,
    handleGetRecommendations,
    handleGoToCollectionByName,
  };
}

/**
 * Utility functions
 */
export function useShopUtilities() {
  function localImagePath(path: string) {
    return `/${path}`;
  }

  /**
   * Builds the full url path to the
   * django /media/ backend folder for
   * images that require this construction
   */
  function djangoMediaPath(path: string, mediaPrefix: boolean = false) {
    let url;

    if (!path || isUndefined(path)) {
      return localImagePath("placeholder.svg");
    }

    if (import.meta.env.DEV) {
      url = import.meta.env.VITE_DEVELOPMENT_URL;
    } else {
      url = import.meta.env.VITE_PRODUCTION_URL;
    }

    if (mediaPrefix) {
      url += "/media/";
    }

    const finalUrl = new URL(path, url);
    return finalUrl.toString();
  }

  /**
   * Builds the full url path to the
   * django /media/ backend folder for
   * images that require this construction
   * and if the image is null, return a fallback
   * placeholder image
   *
   * @param {String} path The path to the image `/media/../image.jpg`
   * @param {string} [fallback='placeholder.svg'] The fallback image to use
   */
  function conditionalImagePath(path: string, fallback: string = "placeholder.svg") {
    const result = djangoMediaPath(path);
    if (!result) {
      return localImagePath(fallback);
    } else {
      return result;
    }
  }

  /**
   * Parses an incoming price/float formatted
   * as a string and then returns the currency
   * version of said number
   */
  // function translatePrice(price: string) {
  //   const { n } = useI18n();

  //   if (!price || typeof price === "undefined") {
  //     return n(0, "currency");
  //   }

  //   const priceNumber = parseFloat(price);
  //   return n(priceNumber, "currency");
  // }

  /**
   * From a product object parse the path
   * for the main image
   */
  function parseMainImage(product: Product, size: string = "original") {
    const data = product.get_main_image;
    if (data === null || typeof data === "undefined") {
      return localImagePath("placeholder.svg");
    } else {
      return djangoMediaPath(data[size]);
    }
  }

  return {
    parseMainImage,
    conditionalImagePath,
    djangoMediaPath,
    localImagePath,
    // translatePrice,
  };
}
