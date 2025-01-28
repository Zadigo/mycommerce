"""This module contains the algorithms that can be used
to create a list of recommended products based on a target
product or set set of target products"""

import re
from difflib import SequenceMatcher
import random
import Levenshtein
from rapidfuzz import fuzz, process
from thefuzz import fuzz as thefuzz
import pandas
from unidecode import unidecode

# https://www.datacamp.com/tutorial/fuzzy-string-python
# https://en.wikipedia.org/wiki/Levenshtein_distance#:~:text=The%20Levenshtein%20distance%20between%20two,Levenshtein%20distance


class FuzzyMatcherMixin:
    """A processor that intends to match words
    that might be similar and therefore create a set
    of recommended products based on word closeness"""

    def __init__(self, threshold=0.85):
        self.threshold = threshold

    def preprocess_text(self, text: str) -> str:
        """Preprocess text for better matching:
            - Convert to lowercase
            - Remove special characters
            - Remove extra whitespace
            - Handle accents
        """
        if not text:
            return ""

        # Convert to lowercase
        text = text.lower()

        # Remove accents
        text = unidecode(text)

        # Remove special characters but keep spaces
        text = re.sub(r'[^a-z0-9\s]', '', text)

        # Remove extra whitespace
        text = ' '.join(text.split())

        return text

    def simple_ratio_match(self, guess: str, target: str) -> float:
        """Basic Levenshtein ratio matching"""
        guess = self.preprocess_text(guess)
        target = self.preprocess_text(target)
        return Levenshtein.ratio(guess, target)

    def partial_ratio_match(self, guess: str, target: str) -> float:
        """Partial ratio matching - good for when guess is part of target
        or vice versa"""
        guess = self.preprocess_text(guess)
        target = self.preprocess_text(target)
        return thefuzz.partial_ratio(guess, target) / 100.0

    def token_sort_ratio_match(self, guess: str, target: str) -> float:
        """Token sort ratio - good for when words are in different orders
        Example: 'hello world' matches 'world hello'"""
        guess = self.preprocess_text(guess)
        target = self.preprocess_text(target)
        return thefuzz.token_sort_ratio(guess, target) / 100.0

    def token_set_ratio_match(self, guess: str, target: str) -> float:
        """Token set ratio - good for partial matches with extra words
        Example: 'hello world' matches 'hello wonderful world'"""
        guess = self.preprocess_text(guess)
        target = self.preprocess_text(target)
        return thefuzz.token_set_ratio(guess, target) / 100.0

    def weighted_ratio_match(self, guess: str, target: str) -> float:
        """Combines multiple matching strategies with weights"""
        simple_ratio = self.simple_ratio_match(guess, target)
        partial_ratio = self.partial_ratio_match(guess, target)
        token_sort = self.token_sort_ratio_match(guess, target)
        token_set = self.token_set_ratio_match(guess, target)

        # Weights for different strategies
        weights = {
            'simple': 0.2,
            'partial': 0.3,
            'token_sort': 0.2,
            'token_set': 0.3
        }

        weighted_score = (
            simple_ratio * weights['simple'] +
            partial_ratio * weights['partial'] +
            token_sort * weights['token_sort'] +
            token_set * weights['token_set']
        )

        return weighted_score

    def is_match(self, guess: str, target: str, match_type='weighted') -> bool:
        """Determine if guess matches target using specified matching strategy"""
        match_functions = {
            'simple': self.simple_ratio_match,
            'partial': self.partial_ratio_match,
            'token_sort': self.token_sort_ratio_match,
            'token_set': self.token_set_ratio_match,
            'weighted': self.weighted_ratio_match
        }

        if match_type not in match_functions:
            raise ValueError(f"Unknown match type: {match_type}")

        score = match_functions[match_type](guess, target)
        return score >= self.threshold

    def get_match_details(self, guess: str, target: str) -> dict:
        """Get detailed matching information for all strategies"""
        return {
            'simple_ratio': self.simple_ratio_match(guess, target),
            'partial_ratio': self.partial_ratio_match(guess, target),
            'token_sort_ratio': self.token_sort_ratio_match(guess, target),
            'token_set_ratio': self.token_set_ratio_match(guess, target),
            'weighted_ratio': self.weighted_ratio_match(guess, target)
        }


class SpacyMixin:
    """A processor that uses the spacy algorithm to create
    a list of recommended products"""

    def recommendation_by_similarity(self, values, products, initial_product, quantity: int) -> list[int]:
        import scpacy
        
        df = pandas.DataFrame(values)

        try:
            calculator = spacy.load('fr_core_news_md')
        except Exception as e:
            # Instead of failing hard, just return
            # the first set of available products
            # to the frontend
            return products[:quantity]

        for item in df.itertuples(name='Product'):
            product_instance = calculator(initial_product.name)
            result = calculator(item.name).similarity(product_instance)
            df.loc[item.Index, 'similarity'] = result

        df = df.sort_values('similarity')
        high_similarity = df.loc[lambda x: x.similarity > 0.8]

        selected_items = random.choices(
            high_similarity.id.to_list(),
            k=quantity
        )
        return selected_items


# Usage in your consumer:
# class SongConsumer(AsyncJsonWebsocketConsumer):
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         self.fuzzy_matcher = FuzzyMatcher(threshold=0.85)

#     async def handle_guess(self, guess):
#         if not self.current_song:
#             return

#         # Check for title match
#         title_match = self.fuzzy_matcher.is_match(
#             guess,
#             self.current_song['title'],
#             match_type='weighted'
#         )

#         # Check for artist match
#         artist_match = self.fuzzy_matcher.is_match(
#             guess,
#             self.current_song['artist'],
#             match_type='weighted'
#         )

#         if title_match or artist_match:
#             # Calculate points based on match quality
#             match_details = self.fuzzy_matcher.get_match_details(
#                 guess,
#                 self.current_song['title'] if title_match else self.current_song['artist']
#             )

#             # Base points multiplied by match quality
#             points = int(100 * match_details['weighted_ratio'])

#             await self.send_json({
#                 'type': 'guess.correct',
#                 'points': points,
#                 'match_quality': match_details['weighted_ratio'],
#                 'matched_field': 'title' if title_match else 'artist'
#             })
