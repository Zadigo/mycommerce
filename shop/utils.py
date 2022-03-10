from django.forms import DecimalField, ValidationError
from django.utils.crypto import get_random_string
from django.db.models import Value
import re


def create_image_slug(name: str, reverse: bool=False):
    """Create an image slug
    
    Example
    -------
    
        an_image_slug.jpg
    
    Parameters
    ----------
    
        reverse: from an image slug, guess the name of the image: an_image_slug 
        becomes in that case 'An image slug'
    """
    if reverse:
        if '_' in name:
            spaced_name = name.split('_')
            cleaned_name = [name.split('.') for name in spaced_name if '.' in name][0][0]
            spaced_name.pop(-1)
            spaced_name.append(cleaned_name)
            return ' '.join(spaced_name).capitalize()

    image_name = '_'.join(name.split(' '))
    return f'{image_name.strip().lower()}.jpg'


def create_product_slug(word: str):
    accents = {
        'é': 'e',
        'è': 'e',
        'ê': 'e',
        'ë': 'e',
        'à': 'a',
        'â': 'a',
        'ô': 'o',
        'ï': 'i',
        'î': 'i',
        'ù': 'u',
        'ü': 'u',
        'ç': 'c'
    }
    words_to_exlude = ['de', 'en', 'le', 'la']
    words = word.split(' ')

    intermediate_word = []
    for i in range(0, len(words)):
        if "d'" in words[i]:
            words[i] = words[i].replace("d'", ' ')
        if words[i] not in words_to_exlude:
            intermediate_word.append(words[i].strip().lower())

    final_word = '-'.join(intermediate_word)
    non_accentuated_word = ''
    for letter in final_word:
        try:
            non_accentuated_word = non_accentuated_word + accents[letter]
        except:
            non_accentuated_word = non_accentuated_word + letter

    return non_accentuated_word


def name_to_snake_case(value: str):  
    value = value.replace(' ', '_')
    value = value.replace('-', '_')
    return value.lower().strip()


def remove_special_characters(value):
    result = re.sub(r'[\(\_\-\)\#\!\*\.]', '', value)
    tokens = result.split(' ')
    name = ' '.join([token for token in tokens if token != ''])
    return name.lower()


def process_file_name(value: str):
    basename, ext = value.split('.')
    return basename, ext, get_random_string(12)
    
    
def video_path(instance, filename):
    basename, ext, new_name = process_file_name(filename)
    return f"videos/{new_name}.{ext}"


def image_path(instance, filename):
    basename, ext, new_name = process_file_name(filename)
    clean_file_name = name_to_snake_case(remove_special_characters(basename))
    return f"images/{clean_file_name}_{new_name}.{ext}"


def calculate_sale(price, percentage):
    price = float(price)
    result = price * (1 - (percentage / 100))
    return Value(result)
