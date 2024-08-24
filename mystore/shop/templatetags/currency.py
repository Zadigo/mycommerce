from django.template import Library
from django.utils.html import format_html, format_html_join

register = Library()


@register.filter
def euro(value):
    return f'{value}€'


@register.filter
def percentage(value):
    return f'-{value}%'


@register.inclusion_tag('includes/product_rating.html')
def product_rating(value, total_rating=5):
    rating = [i for i in range(value)]
    total_rating_range = [i for i in range(total_rating)]
    remaining = [i for i in range(total_rating - int(value))]
    return {'rating': rating, 'rating_value': value, 'total_rating': total_rating_range, 'remaining': remaining}
