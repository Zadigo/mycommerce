from django.db.models import BooleanField, Case, F, Manager, Q, When
from django.db.models.functions.datetime import ExtractDay
from django.utils import timezone
from shop.choices import GenderChoices


class WomenManager(Manager):
    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(gender_category=GenderChoices.WOMAN)


class MenManager(Manager):
    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(gender_category=GenderChoices.MAN)


class UnisexManager(Manager):
    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(gender_category=GenderChoices.UNISEX)


# class KidsManager(Manager):
#     """"Manager used to return products
#     that are specifically categorized
#     for kids"""

#     def get_queryset(self):
#         qs = super().get_queryset()
#         return qs.filter(gender_category=GenderChoices.KIDS)


class SaleManager(Manager):
    """"Manager used to return products
    that are specifically on sale"""

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(sale_value__gt=0)


class NoveltiesManager(Manager):
    """Manager that returns products that were
    created less than 5-10 days ago"""

    def get_queryset(self):
        qs = super().get_queryset()

        function = ExtractDay(timezone.now().date() - F('created_on'))
        qs1 = qs.annotate(days=function)

        logic = When(Q(days__lte=10) | Q(display_new=True), then=True)
        case_logic = Case(logic, default=False, output_field=BooleanField())

        qs2 = qs1.annotate(marked_as_new=case_logic)
        return qs2.filter(marked_as_new=True).order_by('-created_on')
