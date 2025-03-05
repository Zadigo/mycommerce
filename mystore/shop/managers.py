from django.db.models import Manager


class WomenManager(Manager):
    """"Manager used to return products
    that are specifically categorized
    for women"""

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(gender_category='Womam')


class MenManager(Manager):
    """"Manager used to return products
    that are specifically categorized
    for men"""

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(gender_category='Man')


class KidsManager(Manager):
    """"Manager used to return products
    that are specifically categorized
    for kids"""

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(gender_category='Kids')
