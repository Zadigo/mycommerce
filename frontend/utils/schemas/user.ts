import { z } from 'zod'

export const UserSchema = z.object({
  id: z.number().positive(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  username: z.string(),
  userprofile: z.object({
    id: z.number().positive(),
    stripe_id: z.string(),
    address_set: z.object({
      id: z.number(),
      firstname: z.string(),
      lastname: z.string(),
      address_line: z.string(),
      zip_code: z.string(),
      country: z.string(),
      city: z.string(),
      telephone: z.string(),
      gender: z.string(),
      is_active: z.boolean().default(true),
      created_on: z.string().date()
    }).array()
  })
})

export type ZodUser = z.infer<typeof UserSchema>
