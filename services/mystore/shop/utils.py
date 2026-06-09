import random
import re
import secrets
import unicodedata
from decimal import ROUND_DOWN, Decimal
from urllib.parse import unquote

import unidecode
from django.utils.crypto import get_random_string
from django.utils.text import get_valid_filename
from shop.choices import ColorChoices
from shop.typings import TypeProductModel


def remove_accents(text: str):
    """Removes accents from a given string using the unidecode library."""
    return unidecode.unidecode(text)


def clean_text(text: str) -> str | None:
    """Cleans the input text by removing special characters, extra spaces, and accents.
    It also converts the text to lowercase and capitalizes the first letter of each word."""
    if text is None:
        return None

    text = str(text)
    # Normalize the text to decompose accented characters
    # into their base characters and diacritics
    text = unicodedata.normalize('NFKD', text)

    tokens = text.split(' ')
    text = ' '.join(filter(lambda x: x != '', tokens))
    return text.strip().lower().capitalize()


def create_image_slug(name: str, reverse: bool = False):
    """Create an image slug

    Args:

        name (str): The original name to be transformed into a slug.
        reverse (bool): If True, the function will attempt to reverse the slug back to a more human-readable format. Default is False.
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


def create_slug(word: str, *additional_words: str, generate_random_id: bool = True):
    """Function that creates a slug from a string by removing
    special characters, accents and by transforming the string to lowercase. 
    It also removes some determinants that do not bring any fundamental value 
    to the final string::

        create_slug('Blazzer Strapped')  # Output: 'blazzer_strapped'

    Args:

        word (str): The main string to be transformed into a slug.
        *additional_words (str): Additional strings to be included in the slug. These will be processed in the same way as the main string and appended to the slug.
        generate_random_id (bool): If True, a random identifier will be appended to the slug to ensure uniqueness. Default is True.
    """
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


def calculate_sale(price: int | float, percentage: int | float):
    """Calculates the discounted price based on 
    the original price and discount percentage.

    This function computes the new price 
    after applying a discount percentage to the 
    original price"""
    result = Decimal(price) * (1 - (Decimal(percentage) / 100))
    return result.quantize(Decimal('.01'), rounding=ROUND_DOWN)


def transform_to_snake_case(value: str):
    value = value.replace(' ', '_')
    value = value.replace('-', '_')
    return value.lower().strip()


def remove_special_characters(value: str):
    result = re.sub(r'[\(\-\)\#\!\*\.\W]', ' ', value)
    tokens = result.split(' ')
    name = ' '.join([token for token in tokens if token != ''])
    return name.lower()


def process_file_name(value: str):
    """Changes the initial file name to a
    random more standard string that can be used 
    as a file name for the media files.

    For example, 'jupé coûpe.jpg' becomes 'jupe_coupe.jpg'::

        name, ext = process_file_name('jupé coûpe.jpg')
        print(name)  # Output: 'jupe_coupe'
        print(ext)   # Output: 'jpg'

    Returns:
        tuple(str, str): A tuple containing the processed file name and its extension.
    """
    basename, ext = value.split('.')
    basename = unquote(basename)
    return get_valid_filename(basename).lower(), ext


def product_media_path(filename: str):
    """Function that generates a new file name for the media 
    files of the products. It transforms the initial file name to a more standard 
    string and adds a random unique identifier to avoid integrity errors. 

    Example with 'Blazer Strapped.jpg'::

        new_filename = product_media_path('Blazer Strapped.jpg')
        print(new_filename)  # Output: 'blazer_strapped_abc123.jpg'

    Args:
        filename (str): The original file name to be processed.

    Returns:
        str: The new file name with a unique identifier.
    """
    unique_identifier = get_random_string(12)
    basename, ext = process_file_name(filename)
    snaked_case_name = transform_to_snake_case(basename)
    return f"{snaked_case_name}_{unique_identifier}.{ext}"


def video_path(instance: TypeProductModel, filename: str):
    new_name = product_media_path(filename)
    return f"videos/{new_name}"


def image_path(instance: TypeProductModel, filename: str):
    new_name = product_media_path(filename)
    return f"images/{new_name}"


def generate_sku(color: str | None, length: int = 8) -> str:
    """Function that generates a SKU based on
    the color and a random hexadecimal string

    Args:
        color (str | None): The color to be included in the SKU. If None, a random string will be used.
        length (int): The length of the random hexadecimal string to be generated. Default is 8.

    Returns:
        str: A SKU string in the format "COLXXX", where "COL" is the
        first three letters of the color and "XXX" is a random hexadecimal string.
    """
    if color is None:
        color = get_random_string(5)

    if isinstance(color, ColorChoices):
        color = color.value

    prefix = color[:3].upper()
    return f"{prefix}{secrets.token_hex(length).upper()}"
