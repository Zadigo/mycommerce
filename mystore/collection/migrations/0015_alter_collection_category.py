# Generated by Django 5.0.6 on 2024-07-17 15:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collection', '0014_alter_collection_category_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collection',
            name='category',
            field=models.CharField(choices=[('Accessories', 'Accessories'), ('Activewear', 'Activewear'), ('Bags', 'Bags'), ('Bras', 'Bras'), ('Denim', 'Denim'), ('Dresses', 'Dresses'), ('Pants', 'Pants'), ('Panties', 'Panties'), ('Shoes', 'Shoes'), ('Skirts', 'Skirts'), ('Shorts', 'Shorts'), ('Suits', 'Suits'), ('Tops', 'Tops'), ('Not attributed', 'Not Attributed'), ('Other', 'Other')], default='Shorts', help_text='Global category for the given collection', max_length=100),
        ),
    ]
