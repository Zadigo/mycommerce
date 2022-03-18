import re
from typing import Any

from django.db.models import Value
from django.utils.crypto import get_random_string


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


def create_product_slug(word: str, *additional_words):
    accents = {
        'à': 'a',
        'â': 'a',
        'ä': 'a',
        'é': 'e',
        'è': 'e',
        'ë': 'e',
        'ê': 'e',
        'ï': 'i',
        'î': 'i',
        'ô': 'o',
        'ù': 'u',
        'ü': 'u',
        'û': 'u',
        'ç': 'c'
    }
    # List of determinants to exclude
    words_to_exlude = ['de', 'en', 'le', 'la', 'à', 'un', 'une', 'les', 'et']
    words = word.split(' ')
    words.extend(list(additional_words))

    def filter_function(word):
        if "d'" in word:
            new_word = word.replace("d'", ' ')
            return new_word.strip().lower()

        if word not in words_to_exlude:
            return word.strip().lower()
        return ''
    
    intermediate_words = map(filter_function, words)
    clean_words  = filter(lambda x: x != '', intermediate_words)
    # intermediate_word = []
    # for i in range(0, len(words)):
    #     if "d'" in words[i]:
    #         words[i] = words[i].replace("d'", ' ')
            
    #     if words[i] not in words_to_exlude:
    #         intermediate_word.append(words[i].strip().lower())

    final_word = '-'.join(clean_words)
    non_accentuated_word = ''
    for letter in final_word:
        try:
            non_accentuated_word = non_accentuated_word + accents[letter]
        except:
            non_accentuated_word = non_accentuated_word + letter

    return non_accentuated_word


def calculate_sale(price: Any, percentage: int):
    price = float(price)
    result = price * (1 - (percentage / 100))
    return Value(result)


def transform_to_snake_case(value: str):  
    value = value.replace(' ', '_')
    value = value.replace('-', '_')
    return value.lower().strip()


def remove_special_characters(value: str):
    result = re.sub(r'[\(\_\-\)\#\!\*\.]', '', value)
    tokens = result.split(' ')
    name = ' '.join([token for token in tokens if token != ''])
    return name.lower()


def process_file_name(value: str):
    basename, ext = value.split('.')
    return basename, ext, get_random_string(12)
    
    
def product_media_path(filename: str):
    basename, ext, unique_identifier = process_file_name(filename)
    return f"{transform_to_snake_case(remove_special_characters(basename))}_{unique_identifier}.{ext}"
    
    
def video_path(instance, filename):
    new_name = product_media_path(filename) 
    return f"videos/{new_name}"


def image_path(instance, filename):
    new_name = product_media_path(filename) 
    return f"images/{new_name}"
