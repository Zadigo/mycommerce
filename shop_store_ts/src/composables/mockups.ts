import { ref } from "vue";
import { Product } from "../types/shop";
import { useUtilities } from "./shop";

/**
 * A special composable that generates products
 * for testing purposes
 */
export function useMockups() {
  const testProducts = ref({});
  const { djangoMediaPath } = useUtilities();

  /**
   *
   * @param {number} [size=100] The number of products to create
   * @returns {Object[]} List of products
   * @returns {Number} returns.id The product ID
   */
  function createMockupProducts(size: number = 100): Product[] {
    const image = djangoMediaPath("placeholder.svg", false);

    const products = Array.from({ length: size }, (k, v) => ({
      id: v + 1,
      name: `Soutien-gorge corbeille ${v + 1}`,
      color: "White",
      category: "A-line",
      description: "Discover how to use Schema.org",
      images: [
        {
          id: 1429,
          name: "Jupe Cargo",
          product_set: [
            {
              id: 1105,
              name: "Jupe Cargo LanièRes",
            },
          ],
          original: image,
          thumbnail: image,
          mid_size: image,
        },
      ],
      // sizes: [ 'XS', 'S', 'M' ],
      sizes: [
        {
          id: 1,
          name: "XS",
          sub_category: "Clothe size",
          availability: true,
        },
        {
          id: 2,
          name: "S",
          sub_category: "Clothe size",
          availability: true,
        },
        {
          id: 3,
          name: "M",
          sub_category: "Clothe size",
          availability: false,
        },
      ],
      variants: [1, 2],
      get_main_image: {
        id: 1430,
        name: "Jupe Cargo 2",
        product_set: [
          {
            id: 1105,
            name: "Jupe Cargo LanièRes",
          },
        ],
        original: image,
        thumbnail: image,
        mid_size: image,
      },
      slug: `soutien-gorge-corbeille-${v + 1}`,
      get_price: 45.93,
      price: 45.93,
      active: true,
    }));

    testProducts.value = products;
    return products;
  }

  /**
   *
   * Get a specific product ID or return a random
   * item in the created list of products
   */
  function createMockupProduct(id: number | null = null): Product {
    const products = createMockupProducts();
    if (id) {
      return products[id * 1 + 1];
    } else {
      const randomIndex = Math.floor(Math.random() * products.length) + 1;
      return products[randomIndex];
    }
  }

  return {
    testProducts,
    createMockupProduct,
    createMockupProducts,
  };
}
