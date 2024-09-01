import { useIonRouter } from "@ionic/vue";

export function useProducts() {
  const router = useIonRouter();

  /**
   * 
   */
  function handleGoToProduct() {
    router.push("/tabs/tab1/product");
  }

  return {
    handleGoToProduct
  };
}
