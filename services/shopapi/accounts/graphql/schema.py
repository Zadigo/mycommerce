import graphene
from django.contrib.auth import get_user_model
from graphql import GraphQLResolveInfo
from accounts.models import UserProfile
from accounts.graphql.types import UserProfileType, UserType


class UserProfileQuery(graphene.ObjectType):
    all_user_profiles = graphene.List(UserProfileType)
    user_profile = graphene.Field(UserProfileType, id=graphene.Int(required=True))

    def resolve_all_user_profiles(root, info: GraphQLResolveInfo):
        return UserProfile.objects.all()
    
    def resolve_user_profile(root, info: GraphQLResolveInfo, id: int):
        return UserProfile.objects.get(id=id)


class UserQuery(graphene.ObjectType):
    all_users = graphene.List(UserType)
    user = graphene.Field(UserType, id=graphene.Int(required=True))
    

    def resolve_all_users(root, info: GraphQLResolveInfo):
        return get_user_model().objects.all()

    def resolve_user(root, info: GraphQLResolveInfo, id: int):
        return get_user_model().objects.get(id=id)

    