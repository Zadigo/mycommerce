import { z } from 'zod'

export const CollectionSchema = z.object({
  id: z.number().positive(),
  name: z.string().nonempty(),
  category: z.string(),
  sub_category: z.string(),
  number_of_items: z.number().positive(),
  illustration: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  get_view_name: z.string().nonempty()
})

export type ValidateCollection = z.infer<typeof CollectionSchema>
