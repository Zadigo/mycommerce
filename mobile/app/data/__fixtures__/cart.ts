import type { CartUpdateApiResponse } from "~/types";

export const cartApiResponseFixture: CartUpdateApiResponse = {
  session_id: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlY29tbWVyY2UiLCJhdWQiOiJjYXJ0Iiwic3ViIjoiY2FydCIsImV4cCI6MTc1NDc1MDYyNCwiaWF0IjoxNzU0NjY0MjI0LCJ0eXAiOiJKV1QiLCJ1c2VyX2lkIjoxLCJjYXJ0X2lkIjoiSkhCa0dXM2Z6dkRCdFJ0WGpXSlkifQ.TzIjw8O3Sov-E3mcFRYMD4v9pdXosA8SP0XWqxM-SeY",
  results: [
    {
      id: 2,
      product: {
        id: 72,
        name: "Minijupe serge",
        sku: "PIN8981282724",
        color: "Pink",
        category: "Dresses",
        sub_category: "Not attributed",
        sizes: [
          {
            id: 41,
            name: "S",
            metric: "Clothe",
            availability: true,
            active: true
          },
          {
            id: 42,
            name: "M",
            metric: "Clothe",
            availability: true,
            active: true
          },
          {
            id: 40,
            name: "XS",
            metric: "Clothe",
            availability: true,
            active: true
          }
        ],
        has_sizes: true,
        unit_price: "19.99",
        get_price: "12.79",
        sale_value: 36,
        sale_price: "12.79",
        on_sale: true,
        collection_set: [
          {
            id: 1,
            name: "Mini-Jupes",
            category: "Skirts",
            sub_category: "Not attributed",
            number_of_items: 44,
            illustration: null,
            tags: null,
            get_view_name: "mini-jupes"
          }
        ],
        get_main_image: null,
        images: [],
        model_height: "193",
        model_size: "M",
        color_variant_name: "Minijupe serge Pink",
        is_new: true,
        active: true,
        display_new: true,
        slug: "minijupe-serge-pink-367042",
        modified_on: "2025-06-12",
        created_on: "2025-06-13"
      },
      size: "XS",
      price: "12.79",
      created_on: "2025-08-08T15:12:09.824241Z"
    }
  ],
  statistics: [
    {
      product__id: 72,
      product__name: "Minijupe serge",
      size: "XS",
      quantity: 1,
      total: 12.79
    }
  ],
  total: 12.79
}
