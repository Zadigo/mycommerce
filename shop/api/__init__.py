from rest_framework.pagination import LimitOffsetPagination


class CustomPagination(LimitOffsetPagination):
    default_limit = 34
    max_limit = 34
