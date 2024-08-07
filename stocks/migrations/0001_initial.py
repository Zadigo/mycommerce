# Generated by Django 5.0.6 on 2024-07-16 22:02

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('shop', '0011_alter_product_color'),
    ]

    operations = [
        migrations.CreateModel(
            name='Isle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('shortname', models.CharField(max_length=5)),
                ('description', models.CharField(blank=True, help_text='Describe what the isle contains', max_length=200, null=True)),
                ('total_capacity', models.PositiveIntegerField(default=1)),
                ('created_on', models.DateField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(default=20)),
                ('total', models.DecimalField(decimal_places=2, help_text='The total value of the stock', max_digits=5)),
                ('is_active', models.BooleanField(default=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shop.product')),
            ],
            options={
                'indexes': [models.Index(condition=models.Q(('is_active', True)), fields=['is_active'], name='active_stocks'), models.Index(condition=models.Q(('quantity__gte', 10)), fields=['quantity'], name='high_stock'), models.Index(condition=models.Q(('quantity__lte', 10)), fields=['quantity'], name='low_stock')],
            },
        ),
    ]
