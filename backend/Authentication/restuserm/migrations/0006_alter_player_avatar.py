# Generated by Django 5.0.6 on 2024-08-18 12:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restuserm', '0005_match_game_match_round_match_state_alter_match_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='avatar',
            field=models.URLField(default='https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg'),
        ),
    ]