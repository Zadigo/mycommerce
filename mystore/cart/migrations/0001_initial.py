# Generated by Django 5.0.4 on 2024-05-04 14:36

import django.db.models.deletion
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
            name='Cart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session_id', models.CharField(help_text="Unique session identifier for the user's carts", max_length=100)),
                ('size', models.CharField(blank=True, choices=[('Unique', 'Unique'), ('XXS', 'XXS'), ('XS', 'XS'), ('S', 'S'), ('M', 'M'), ('L', 'L'), ('XL', 'XL')], default='Unique', max_length=100, null=True)),
                ('price', models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ('is_stale', models.BooleanField(default=False, help_text='Previous products from an authenticated user on which no actions were performed')),
                ('is_anonymous', models.BooleanField(default=False)),
                ('is_paid_for', models.BooleanField(default=False)),
                ('created_on', models.DateTimeField(auto_now=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shop.product')),
                ('user', models.ForeignKey(blank=True, help_text='Identifies a logged in user', null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Cart',
                'verbose_name_plural': 'Carts',
                'ordering': ['-created_on', '-pk'],
                'abstract': False,
                'indexes': [models.Index(fields=['price', 'session_id'], name='cart_cart_price_5994ec_idx')],
            },
        ),
    ]