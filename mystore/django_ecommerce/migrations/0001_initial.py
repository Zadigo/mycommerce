# Generated by Django 5.1.4 on 2025-04-26 13:58

import django_ecommerce.utils
import django_ecommerce.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='LegalBusiness',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('version', models.PositiveIntegerField(default=0)),
                ('modified_on', models.DateField(auto_now_add=True)),
                ('created_on', models.DateField(auto_now=True)),
                ('legal_name', models.CharField(blank=True, max_length=100, null=True)),
                ('registration_place', models.CharField(blank=True, help_text='Place where the company was registered', max_length=200, null=True)),
                ('company_type', models.CharField(choices=[('A', 'A'), ('B', 'B')], default='B', help_text="'A' for commerce, 'B' for company", max_length=2)),
                ('siren', models.CharField(blank=True, max_length=9, null=True, unique=True, validators=[django_ecommerce.validators.validate_siren], verbose_name='SIREN')),
                ('siret', models.CharField(blank=True, max_length=14, null=True, unique=True, validators=[django_ecommerce.validators.validate_siret], verbose_name='SIRET')),
                ('ape', models.CharField(blank=True, help_text='The APE code for the business', max_length=5, null=True, validators=[django_ecommerce.validators.validate_ape], verbose_name='Code APE')),
                ('founding_date', models.DateField(blank=True, null=True)),
                ('general_email', models.EmailField(blank=True, max_length=254, null=True)),
                ('customer_service_email', models.EmailField(blank=True, max_length=254, null=True)),
                ('telephone', models.CharField(blank=True, max_length=100, null=True)),
                ('address_line', models.CharField(blank=True, max_length=300, null=True)),
                ('locality', models.CharField(blank=True, max_length=100, null=True)),
                ('region', models.CharField(blank=True, max_length=100, null=True)),
                ('postal_code', models.CharField(blank=True, max_length=100, null=True)),
                ('country', models.CharField(blank=True, max_length=100, null=True)),
                ('logo', models.ImageField(blank=True, help_text='Ideally should be a square e.g. 200x200', null=True, upload_to=django_ecommerce.utils.upload_logo_to)),
                ('return_fee', models.DecimalField(decimal_places=2, default=0, help_text='Return fee applied wwhen the user returns one or multiple products in a a drop off', max_digits=5)),
                ('home_collection_return_fee', models.DecimalField(decimal_places=2, default=0, help_text='Return fee applied wwhen the user returns one or multiple products via home collection', max_digits=5)),
            ],
            options={
                'verbose_name_plural': 'legal businesses',
                'ordering': ['version'],
            },
        ),
        migrations.CreateModel(
            name='SocialNetwork',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('version', models.PositiveIntegerField(default=0)),
                ('modified_on', models.DateField(auto_now_add=True)),
                ('created_on', models.DateField(auto_now=True)),
                ('linkedin', models.URLField(blank=True, help_text='LinkedIn business page', null=True)),
                ('facebook', models.URLField(blank=True, help_text='Facebook business page', null=True)),
                ('instagram', models.URLField(blank=True, help_text='Instagram profile page', null=True)),
                ('twitter', models.URLField(blank=True, help_text='Twitter business page', null=True)),
                ('youtube', models.URLField(blank=True, help_text='YouTube channel', null=True)),
                ('tiktok', models.URLField(blank=True, help_text='Tiktok page', null=True)),
            ],
            options={
                'ordering': ['version'],
                'abstract': False,
            },
        ),
    ]
