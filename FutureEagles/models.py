from django.db import models

# Create your models here.
class Job(models.Model):
    user = models.CharField(max_length=20)
    task = models.CharField(max_length=999)
    due_date = models.CharField(max_length=11)
    status = models.CharField(max_length=10)



class Google_user(models.Model):
    user_profile = models.CharField(max_length=99)
    user_id = models.CharField(max_length=90)
    user_image = models.CharField(max_length=999)
    user_email = models.CharField(max_length=99)
