from django import forms
from django.forms import fields, widgets

# https://docs.djangoproject.com/en/5.0/topics/http/file-uploads/#uploading-multiple-files

class MultipleFileInput(widgets.ClearableFileInput):
    allow_multiple_selected = True


class MultipleFileField(fields.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('widget', MultipleFileInput())
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        clean_func = super().clean
        if isinstance(data, (list, tuple)):
            result = [clean_func(item, initial) for item in data]
        else:
            result = [clean_func(data, initial)]
        return result


class UploadImagesForm(forms.Form):
    file_name = fields.CharField(
        max_length=100,
        required=True,
        widget=widgets.TextInput(
            attrs={
                'placeholder': 'File name'
            }
        )
    )
    variant = fields.CharField(
        max_length=100,
        required=False,
        widget=widgets.TextInput(
            attrs={
                'placeholder': 'Image variant'
            }
        )
    )
    images = MultipleFileField()

    def clean_file_name(self):
        value = self.cleaned_data['file_name']
        new_value = value.lower().title()
        tokens = filter(lambda x: x != '', new_value.split(' '))
        return ' '.join(tokens)

    def clean_variant(self):
        variant = self.cleaned_data['variant']
        return variant.lower().title()
