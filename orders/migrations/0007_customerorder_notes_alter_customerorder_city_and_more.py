# Generated by Django 5.0.6 on 2024-06-19 11:37

import django_ckeditor_5.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0006_alter_customerorder_city_alter_customerorder_country'),
    ]

    operations = [
        migrations.AddField(
            model_name='customerorder',
            name='notes',
            field=django_ckeditor_5.fields.CKEditor5Field(blank=True, max_length=5000, null=True),
        ),
        migrations.AlterField(
            model_name='customerorder',
            name='city',
            field=models.CharField(choices=[('Lille', 'Lille'), ('Paris', 'Paris')], default='Lille', max_length=100),
        ),
        migrations.AlterField(
            model_name='customerorder',
            name='country',
            field=models.CharField(choices=[('France', 'France'), ('Guadeloupe', 'Guadeloupe'), ('Martinique', 'Martinique'), ('Monaco', 'Monaco'), ('Réunion', 'Reunion')], default='France', max_length=100),
        ),
    ]