# Generated by Django 5.0.6 on 2024-08-23 07:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restuserm', '0002_alter_player_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='friendships',
            name='status',
            field=models.CharField(choices=[('PEN', 'PENDING'), ('ACP', 'ACCEPTED'), ('BLK', 'BLOCKED')], default='PEN', max_length=3),
        ),
    ]
