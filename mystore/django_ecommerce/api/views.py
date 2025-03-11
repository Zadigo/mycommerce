from django_ecommerce.api.serializers import LegalBusinessSerializer
from django_ecommerce.models import LegalBusiness
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny


class PolicyDetails(GenericAPIView):
    serializer_class = LegalBusinessSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return LegalBusiness.objects.get_latest_version()
