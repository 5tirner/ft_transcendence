# Generated by Django 5.0.6 on 2024-09-14 16:41

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Player',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=20, unique=True)),
                ('email', models.EmailField(max_length=30, unique=True)),
                ('first_name', models.CharField(max_length=20)),
                ('last_name', models.CharField(max_length=20)),
                ('alias_name', models.CharField(max_length=20, null=True)),
                ('avatar', models.URLField(default='https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg')),
                ('champions', models.IntegerField(default=0)),
                ('wins', models.IntegerField(default=0)),
                ('losses', models.IntegerField(default=0)),
                ('two_factor', models.BooleanField(default=False)),
                ('status', models.CharField(choices=[('ON', 'ONLINE'), ('OFF', 'OFFLINE'), ('ING', 'INGAME')], default='OFF', max_length=3)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Match',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('state', models.CharField(choices=[('PLYD', 'PLAYED'), ('UPLY', 'UNPLAYED')], default='UPLY', max_length=4)),
                ('round', models.IntegerField(default=1)),
                ('game', models.CharField(choices=[('PON', 'PONG'), ('TIC', 'TICTACTOE')], default='PON', max_length=3)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Friendships',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('status', models.CharField(choices=[('PEN', 'PENDING'), ('ACP', 'ACCEPTED'), ('BLK', 'BLOCKED')], default='PEN', max_length=3)),
                ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friend_request_received', to=settings.AUTH_USER_MODEL)),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friend_request_sent', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PlayerGameMatch',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('won', models.BooleanField(default=False)),
                ('score', models.IntegerField(default=0)),
                ('exec_path', models.CharField(max_length=255, null=True)),
                ('id_match', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='restuserm.match')),
                ('id_player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
