import { z } from 'zod'

export type Languages = 'fr' | 'en' | 'es'

export type LanguageOptions = {
  choice: Languages
  selected: boolean
}

// export interface PopularImages {
//   product_id: number
//   image_url: string
//   count: number
// }

export interface SessionData {
  /**
   * Used to store the language preference of the user
   */
  language: LanguageOptions
  /**
   * Used to store the recommendations for the user
   */
  recommendations: number[]
  /**
   * Used to store the search history of the user
   */
  searchHistory: string[]
  /**
   * Used to store the liked products for the user
   */
  // likedProducts: number[]
  /**
   * Used to store the popular images for the user
   */
  // popularImages: PopularImages[]
}

export const SessionDataSchema = z.object({
  language: z.object({
    choice: z.enum(['fr', 'en', 'es']).default('fr').describe('Used to store the language preference of the user'),
    selected: z.boolean().default(false)
  }).describe('Used to store the language preference of the user'),
  recommendations: z.array(z.number()),
  searchHistory: z.array(z.string())
})

export type _SessionData = z.infer<typeof SessionDataSchema>

