# Generated by Django 5.0.7 on 2024-08-12 16:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pong', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='playerAndHisPic',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('login', models.CharField(max_length=20)),
                ('pic', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='pongHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('you', models.CharField(max_length=20)),
                ('oppenent', models.CharField(max_length=20)),
                ('winner', models.CharField(max_length=20)),
            ],
        ),
    ]