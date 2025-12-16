/**
 * Type for GraphQL pagination info using Relay-style pagination
 */
export interface GraphQlPaginationInfo {
  pageInfo: {
    startCursor: string
    endCursor: string
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

/**
 * Type for Relay Node structure
 * @example
 * ```tags
 * const relayNode: RelayNode<Video> = { edges: [ { node: Video }, ... ] }
 * ```
 */
export type RelayNode<N> = {
  node: N
}

export type RelayEdge<E> = {
  edges: Array<RelayNode<E>>
}

export type RelayNodeWithPagination<E> = RelayEdge<E> & GraphQlPaginationInfo

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
