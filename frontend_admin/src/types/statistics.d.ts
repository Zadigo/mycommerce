interface Orders {
    total: {
        id__count: number,
        total__avg: number
        total__max: number
        total__min: number
        total__stddev: number
        total__variance: number
    }
    month: {
        id__count: number
        total__avg: number
        total__max: number
        total__min: number
        total__stddev: number
        total__variance: number
    },
    current_month: null,
    id__count: number
    price__avg: number
    price__max: number
    price__min: number
    price__stddev: number,
    price__variance: number
    top_selling_products: [
        {
            id: number
            product__name: string
            selling_rank: number
        }
    ]
}

export interface Products {
    global: {
        id__count: number
        unit_price__avg: number,
        unit_price__min: number
        unit_price__max: number
    },
    products_on_sale: number
}

export interface ShopStatistics {
    orders: Orders
    products: Products
}
