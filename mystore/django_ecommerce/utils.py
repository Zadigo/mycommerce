def upload_logo_to(instance, name):
    new_name = get_random_string(length=5)
    _, extension = name.split('.')
    if extension not in ['png', 'jpg', 'jpeg']:
        raise ValidationError('File extension should be png, jpg or jpeg')
    return f'business/{new_name}.{extension}'
