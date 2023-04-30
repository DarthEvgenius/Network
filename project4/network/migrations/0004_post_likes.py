# Generated by Django 4.1.5 on 2023-04-30 13:40

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0003_follow'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='likes',
            field=models.ManyToManyField(related_name='user_likes', to=settings.AUTH_USER_MODEL, verbose_name='Users that liked post'),
        ),
    ]
