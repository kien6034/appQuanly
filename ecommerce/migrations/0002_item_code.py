# Generated by Django 3.1.5 on 2021-01-28 09:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecommerce', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='code',
            field=models.CharField(default=1, max_length=3),
            preserve_default=False,
        ),
    ]
