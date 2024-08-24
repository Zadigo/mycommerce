from rest_framework.permissions import IsAdminUser, IsAuthenticated


class IsMarketer(IsAdminUser):
    pass


class IsSales(IsAdminUser):
    pass
