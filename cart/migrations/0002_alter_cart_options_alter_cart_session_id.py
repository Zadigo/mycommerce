# Generated by Django 4.0.1 on 2022-04-20 21:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='cart',
            options={'ordering': ['-created_on', '-pk'], 'verbose_name': 'Cart', 'verbose_name_plural': 'Carts'},
        ),
        migrations.AlterField(
            model_name='cart',
            name='session_id',
            field=models.CharField(help_text="Unique identifier to identify user's carts", max_length=100),
        ),
    ]