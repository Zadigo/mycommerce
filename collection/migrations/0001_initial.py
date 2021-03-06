# Generated by Django 4.0.1 on 2022-04-18 12:07

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('shop', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Collection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('category', models.CharField(choices=[('Accessories', 'Accessories'), ('Activewear', 'Activewear'), ('Bags', 'Bags'), ('Bras', 'Bras'), ('Denim', 'Denim'), ('Dresses', 'Dresses'), ('Pants', 'Pants'), ('Panties', 'Panties'), ('Shoes', 'Shoes'), ('Shorts', 'Shorts'), ('Suits', 'Suits'), ('Tops', 'Tops')], default='Shorts', max_length=100)),
                ('description', models.TextField(blank=True, max_length=500, null=True)),
                ('illustration', models.ImageField(blank=True, null=True, upload_to='')),
                ('tags', models.CharField(blank=True, max_length=100, null=True)),
                ('slug', models.SlugField()),
                ('created_on', models.DateField(auto_now_add=True)),
                ('products', models.ManyToManyField(blank=True, to='shop.Product')),
            ],
        ),
    ]
