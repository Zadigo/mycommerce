# Generated by Django 5.0.4 on 2024-05-26 15:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0002_remove_product_shop_produc_name_21f200_idx_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='color',
            field=models.CharField(choices=[('Prints', 'Prints'), ('Black', 'Black'), ('Beige', 'Beige'), ('Camel', 'Camel'), ('Charcoal', 'Charcoal'), ('Cream', 'Cream'), ('Green', 'Green'), ('Grey', 'Grey'), ('Kaki', 'Kaki'), ('Marine', 'Marine'), ('Navy', 'Navy'), ('Orange', 'Orange'), ('Pink', 'Pink'), ('Red', 'Red'), ('Taupe', 'Taupe'), ('White', 'White'), ('Yellow', 'Yellow')], default='Black', help_text='Product available colors', max_length=100),
        ),
        migrations.AddIndex(
            model_name='product',
            index=models.Index(condition=models.Q(('active', True)), fields=['active'], name='active_products'),
        ),
    ]
