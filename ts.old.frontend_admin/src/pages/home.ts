export interface StatisticsResponseAPI {
    total: {
        id__count: number | null
        total__avg: number | null
        total__max: number | null
        total__min: number | null
        total__stddev: number | null
        total__variance: number | null
    },
    month: {
        id__count: number | null
        total__avg: number | null
        total__max: number | null
        total__min: number | null
        total__stddev: number | null
        total__variance: number | null
    },
    current_month: null
    id__count: number | null
    price__avg: number | null
    price__max: number | null
    price__min: number | null
    price__stddev: number | null
    price__variance: number | null
    top_selling_products: [
        {
            id: number,
            product__name: string
            selling_rank: number
        }
    ]
}
