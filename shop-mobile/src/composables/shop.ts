import { useShop } from "@/stores/shop";
import { Product, ProductCollections } from "@/types/collections";
import { useIonRouter } from "@ionic/vue";
import { storeToRefs } from "pinia";

export function useProducts() {
  const router = useIonRouter();
  const storeShop = useShop();
  const { currentProduct, currentCollection } = storeToRefs(storeShop);

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
  function handleGoToCollection(collection: ProductCollections) {
    currentCollection.value = collection;
    router.push("/tabs/tab1/products");
  }

  /**
   * See the details for the current given collection
   * in the collection's page
   */
  async function handleGoToCollectionByName(name: string) {
    try {
      name;
      const response = { data: { id: 1 } };
      handleGoToCollection(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  return {
    handleGoToProduct,
    handleGoToCollection,
    handleGoToCollectionByName,
  };
}
