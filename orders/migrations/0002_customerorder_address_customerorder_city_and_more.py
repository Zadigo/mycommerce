# Generated by Django 4.0.1 on 2022-04-13 16:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customerorder',
            name='address',
            field=models.CharField(default='36 rue de Suède', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customerorder',
            name='city',
            field=models.CharField(choices=[('Lille', 'Lille'), ('Paris', 'Paris')], default='Lille', max_length=100),
        ),
        migrations.AddField(
            model_name='customerorder',
            name='country',
            field=models.CharField(choices=[('France', 'France'), ('Guadeloupe', 'Guadeloupe'), ('Martinique', 'Martinique'), ('Monaco', 'Monaco'), ('Réunion', 'Reunion')], default='France', max_length=100),
        ),
        migrations.AddField(
            model_name='customerorder',
            name='zip_code',
            field=models.CharField(default='59000', max_length=100),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='customerorder',
            name='reference',
            field=models.CharField(default='kAvrn80hJPOy', max_length=100, unique=True),
        ),
    ]