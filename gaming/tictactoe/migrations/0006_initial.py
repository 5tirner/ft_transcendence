# Generated by Django 5.0.6 on 2024-07-02 10:15

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tictactoe', '0005_delete_players'),
    ]

    operations = [
        migrations.CreateModel(
            name='players',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gcreator', models.CharField(max_length=100)),
                ('oppenent', models.CharField(max_length=100)),
                ('roomcode', models.CharField(max_length=100)),
                ('gamestat', models.BooleanField(default=False)),
                ('board', models.CharField(default='.........', max_length=8)),
                ('channel', models.CharField(max_length=100)),
            ],
        ),
    ]