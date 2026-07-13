import { GraphQLQuery, Nullable } from '../..'

export type BaseUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: Nullable<string>
  createdOn: string
  updatedOn: string
}

export type BaseUserProfile = {
  id: string
  stripeId: Nullable<string>
}

export type User = GraphQLQuery<'user', BaseUser>

export type UserProfile = GraphQLQuery<'userProfile', BaseUserProfile>
