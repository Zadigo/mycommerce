export * from './user'
export * from './shipping'

/**
 * Access/Refresh token pair used to authenticate
 * the user on the Django backend 
 */
export interface LoginApiResponse {
  access: string
  refresh: string
}

/**
 * Response from refresh token request made
 * by Nuxt when the access token is expired 
 * 
 * {@link ~/plugins/client.ts Internal Nuxt Fetch client}
 */
export type TokenRefreshApiResponse = Pick<LoginApiResponse, 'access'>
