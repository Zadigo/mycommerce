
/**
 * Type for GraphQL pagination info using Relay-style pagination
 */
export interface GraphQlPaginationInfo {
  pageInfo: Partial<{
    startCursor: string
    endCursor: string
    hasNextPage: boolean
    hasPreviousPage: boolean
  }>
}

/**
 * Type for Relay Node structure
 * @example
 * ```ts
 * const relayNode: RelayNode<Video> = { node: Video }
 * ```
 */
export type RelayNode<N> = {
  node: N
}

export type RelayEdge<E> = { edges: Array<RelayNode<E>> } & Partial<GraphQlPaginationInfo>

/**
 * Type for GraphQL response data
 * @example
 * ```ts
 * 
 * // With relay nodes
 * const response = $fetch<GraphQlData<'allvideos', RelayEdge<Video>>>(...)
 * 
 * // With single data
 * const response = $fetch<GraphQlData<'videoDetails', VideoDetails>>(...)
 * 
 * // With array of data
 * const response = $fetch<GraphQlData<'searchvideos', Video[]>>(...)
 * ```
 */
export interface GraphQlData<K extends string, R> {
  data: {
    [key in K]: R
  }
}
