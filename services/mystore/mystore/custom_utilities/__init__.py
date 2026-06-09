import unidecode


def remove_accents(text):
    text = str(text)
    return unidecode.unidecode(text)
