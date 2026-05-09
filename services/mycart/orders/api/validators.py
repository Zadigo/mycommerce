from rest_framework.exceptions import ValidationError


def validate_card_token(value):
    if not value.startswith('card_'):
        raise ValidationError({
            'token': 'Card is not valid'
        })


def validate_intent_token(value):
    if not value.startswith('tok_'):
        raise ValidationError({
            'token': 'Token is not valid'
        })
