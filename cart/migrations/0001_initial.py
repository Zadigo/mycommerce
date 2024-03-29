# Generated by Django 4.1.3 on 2023-11-18 10:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('shop', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session_id', models.CharField(help_text="Unique session identifier for the user's carts", max_length=100)),
                ('default_size', models.CharField(choices=[('Unique', 'Unique'), ('XXS', 'XXS'), ('XS', 'XS'), ('S', 'S'), ('M', 'M'), ('L', 'L'), ('XL', 'XL')], default='Unique', max_length=100)),
                ('price', models.DecimalField(decimal_places=2, default=0, max_digits=5)),
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
            },
        ),
        migrations.AddIndex(
            model_name='cart',
            index=models.Index(fields=['price', 'session_id'], name='cart_cart_price_5994ec_idx'),
        ),
    ]
