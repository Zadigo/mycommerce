import random
import re
import unicodedata
from decimal import ROUND_DOWN, Decimal

import unidecode
from django.utils.crypto import get_random_string
from django.utils.text import get_valid_filename


def remove_accents(text):
    return unidecode.unidecode(text)


def clean_text(text):
    if text is None:
        return None

    text = str(text)
    text = unicodedata.normalize('NFKD', text)

    tokens = text.split(' ')
    text = ' '.join(filter(lambda x: x != '', tokens))
    return text.strip().lower().capitalize()


def create_image_slug(name: str, reverse: bool = False):
    """Create an image slug

    Parameters
    ----------

        reverse: from an image slug, guess the name of the image: an_image_slug 
        becomes in that case 'An image slug'
    """
    if reverse:
        if '_' in name:
            spaced_name = name.split('_')
            cleaned_name = [
                name.split('.')
                for name in spaced_name if '.' in name
            ][0][0]

            spaced_name.pop(-1)
            spaced_name.append(cleaned_name)
            return ' '.join(spaced_name).capitalize()

    image_name = '_'.join(name.split(' '))
    return f'{image_name.strip().lower()}.jpg'


def create_slug(word, *additional_words, generate_random_id=True):
    # List of determinants to exclude from
    # the text and that do not bring any
    # fundamental value to the final string
    words_to_exlude = ['de', 'en', 'le', 'la', 'à', 'un', 'une', 'les', 'et']
    words = word.split(' ')
    words.extend(list(additional_words))

    def word_mapper(word):
        if word is None:
            return ''

        if isinstance(word, int):
            return str(word)

        if word == '-':
            return ''

        apostrophe_tokens = [
            "l'", "L'", "d'",
            "D'", "m'", "M'", "n'", "N'",
            "c'", "C'"
        ]
        for token in apostrophe_tokens:
            if token in word:
                word = word.replace(token, '')

        if word not in words_to_exlude:
            return word.strip().lower()
        return ''

    intermediate_words = map(word_mapper, words)
    clean_words = filter(lambda x: x != '', intermediate_words)

    final_word = '-'.join(clean_words)
    non_accentuated_word = remove_accents(final_word)

    # The random ID can be used to differentiate
    # slugs that can share similarities and
    # therefore create integrity errors
    if generate_random_id:
        random_id = random.randint(1, 800000)
        return f'{non_accentuated_word}-{random_id}'

    return non_accentuated_word


def calculate_sale(price, percentage):
    """Calculates the discounted price based on 
    the original price and discount percentage.

    This function computes the new price 
    after applying a discount percentage to the 
    original price"""
    # price = float(price)
    # result = price * (1 - (percentage / 100))
    # return Value(result)
    result = Decimal(price) * (1 - (Decimal(percentage) / 100))
    return result.quantize(Decimal('.01'), rounding=ROUND_DOWN)


def transform_to_snake_case(value: str):
    # return get_valid_filename(value)
    value = value.replace(' ', '_')
    value = value.replace('-', '_')
    return value.lower().strip()


def remove_special_characters(value: str):
    result = re.sub(r'[\(\-\)\#\!\*\.]', '', value)
    tokens = result.split(' ')
    name = ' '.join([token for token in tokens if token != ''])
    return name.lower()


def process_file_name(value: str):
    """Changes the initial file name to a
    random more standard string"""
    basename, ext = value.split('.')
    return get_valid_filename(basename).lower(), ext


def product_media_path(filename):
    """Function that creates unique identifier for the
    by cleaning it's base name"""
    unique_identifier = get_random_string(12)
    basename, ext = process_file_name(filename)
    return f"{basename}_{unique_identifier}.{ext}"


def video_path(instance, filename):
    new_name = product_media_path(filename)
    return f"videos/{new_name}"


def image_path(instance, filename):
    new_name = product_media_path(filename)
    return f"images/{new_name}"
