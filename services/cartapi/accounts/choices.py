from django.db.models import IntegerChoices


class Genders(IntegerChoices):
    WOMAN = 1, 'Woman'
    MAN = 2, 'Man'
