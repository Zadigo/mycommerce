# Generated by Django 5.0.6 on 2024-12-03 17:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0016_alter_customerorder_city_alter_customerorder_country'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='customerorder',
            options={'ordering': ['-created_on'], 'verbose_name': 'customer order', 'verbose_name_plural': 'customer orders'},
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
