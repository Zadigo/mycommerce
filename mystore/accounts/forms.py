from allauth.socialaccount.forms import DisconnectForm
from allauth.socialaccount.forms import SignupForm as AllAuthSignupForm
from django import forms
from django.contrib.auth.password_validation import validate_password
from django.utils.crypto import get_random_string
from django.utils.http import urlsafe_base64_encode


class SignupForm(forms.Form):
    firstname = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'form-control mb-2 p-3',
                'placeholder': 'Prénom',
                'autocomplete': 'given-name'
            }
        ),
        validators=[]
    )
    lastname = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'form-control mb-2 p-3',
                'placeholder': 'Nom',
                'autocomplete': 'family-name'
            }
        ),
        validators=[]
    )
    email = forms.CharField(
        widget=forms.EmailInput(
            attrs={
                'class': 'form-control mb-2 p-3',
                'placeholder': 'Email',
                'autocomplete': 'email'
            }
        ),
        validators=[]
    )
    password1 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control mb-2 p-3',
                'placeholder': 'Mot de passe',
                'autocomplete': 'current-password'
            }
        )
    )
    passowrd2 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control p-3',
                'placeholder': 'Confirmation du mot de passe',
                'autocomplete': 'current-password'
            }
        )
    )

    def clean(self):
        validated_data = super().clean()

        password1 = validated_data.get('password1')
        password2 = validated_data.get('password2')

        if password1 != password2:
            self.add_error('password1', 'Password do not match')

        validate_password(password1)
        return validated_data


class SocialSignupForm(AllAuthSignupForm):
    def save(self, request):
        user = super().save(request)
        return user


class SocialLogoutForm(DisconnectForm):
    def save(self):
        # Add your own processing here if you do need access to the
        # socialaccount being deleted.

        # Ensure you call the parent class's save.
        # .save() does not return anything
        super().save()
