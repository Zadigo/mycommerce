# Generated by Django 5.0.4 on 2024-05-04 14:36

import django.db.models.deletion
import imagekit.models.fields
import reviews.utils
import reviews.validators
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('shop', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ReviewMedia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', imagekit.models.fields.ProcessedImageField(blank=True, null=True, upload_to=reviews.utils.review_media_path)),
                ('video', models.FileField(blank=True, null=True, upload_to=reviews.utils.review_media_path, validators=[reviews.validators.validate_video])),
                ('created_on', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.PositiveIntegerField(default=1, validators=[reviews.validators.validate_rating])),
                ('title', models.CharField(max_length=200)),
                ('comment', models.TextField(max_length=5000)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shop.product')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('media', models.ManyToManyField(blank=True, to='reviews.reviewmedia')),
            ],
            options={
                'verbose_name': 'Review',
                'ordering': ['-created_on', '-id'],
            },
        ),
    ]