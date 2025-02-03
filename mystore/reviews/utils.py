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


def review_media_path(instance, name):
    name, ext = name.split('.')
    new_name = get_random_string(12)
    return f"reviews/{instance.review.id}/{instance.product.slug}/{new_name}.{ext}"
