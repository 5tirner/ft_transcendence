# Generated by Django 5.0.6 on 2024-07-01 11:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tictactoe', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='players',
            name='board',
            field=models.CharField(default='.........', max_length=8),
        ),
    ]
