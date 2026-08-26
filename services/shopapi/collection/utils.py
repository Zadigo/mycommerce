def create_slug(word):
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
