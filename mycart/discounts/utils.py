from django.utils.crypto import get_random_string

def create_reference():
    return get_random_string(4)


def calculate_discount(price, discount):
    return (price / (1 - discount))
