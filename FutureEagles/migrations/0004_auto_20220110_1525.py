# Generated by Django 3.2.8 on 2022-01-10 20:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('FutureEagles', '0003_google_user_job'),
    ]

    operations = [
        migrations.RenameField(
            model_name='google_user',
            old_name='user_profile',
            new_name='profile_name',
        ),
        migrations.AddField(
            model_name='job',
            name='user_id',
            field=models.CharField(default='', max_length=99),
            preserve_default=False,
        ),
    ]