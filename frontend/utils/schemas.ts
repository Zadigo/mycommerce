import { z } from 'zod'

export const ProductSchema = z.object({
    id: z.number().positive(),
    name: z.string(),
    color: z.string(),
    category: z.string(),
    sub_category: z.string(),
    sizes: z.object({
        id: z.string(),
        name: z.string(),
        sub_category: z.string(),
        availability: z.boolean().default(true)
    }).array(),
    has_sizes: z.boolean().default(false),
    unit_price: z.string().min(1, 'Number must be over 1'),
    get_price: z.string().min(1, 'Number must be over 1'),
    sale_value: z.number().positive(),
    sale_price: z.string(),
    on_sale: z.boolean().default(false),
    collection_set: z.object({
        id: z.number().positive(),
        name: z.string(),
        category: z.string(),
        sub_category: z.string(),
        number_of_items: z.number().positive(),
        illustration: z.string(),
        tags: z.string().array(),
        get_view_name: z.string()
    }).array(),
    get_main_image: z.object({
        id: z.number().positive(),
        name: z.string(),
        product_set: z.object({
            id: z.number().positive(),
            name: z.string()
        }).array(),
        original: z.string(),
        thumbnail: z.string(),
        mid_size: z.string(),
        is_main_image: z.boolean().default(false)
    }),
    images: z.object({
        id: z.number().positive(),
        name: z.string(),
        product_set: z.object({
            id: z.number().positive(),
            name: z.string()
        }).array(),
        original: z.string(),
        thumbnail: z.string(),
        mid_size: z.string(),
        is_main_image: z.boolean().default(false)
    }).array(),
    model_height: z.number().positive().nullable(),
    model_size: z.number().positive().nullable(),
    color_variant_name: z.string(),
    is_new: z.boolean(),
    active: z.boolean(),
    display_new: z.boolean(),
    slug: z.string(),
    variants: z.object({
        id: z.number().positive(),
        color: z.string(),
        get_main_image: z.object({
            id: z.number().positive(),
            name: z.string(),
            product_set: z.object({
                id: z.number().positive(),
                name: z.string()
            }).array(),
            original: z.string(),
            thumbnail: z.string(),
            mid_size: z.string(),
            is_main_image: z.boolean().default(false)
        }),
        active: z.boolean()
    }).array().nullish(),
    modified_on: z.string().date(),
    created_on: z.string().date()
})

export type ValidateProduct = z.infer<typeof ProductSchema>
