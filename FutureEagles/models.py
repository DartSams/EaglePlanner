from django.db import models

# Create your models here.
class Task(models.Model):
    user = models.CharField(max_length=20)
    task = models.CharField(max_length=999)
    due_date = models.CharField(max_length=11)
    status = models.CharField(max_length=10)










































# from django.db import models
from django.db.models.fields import CharField
from django.core.validators import MinLengthValidator
# Create your models here.
class kahoot_class(models.Model):
    pin=models.CharField(max_length=6)
    # def __init__(self):
    student_list={}
    num=0

    def __init__(self):
        pass

    def nth_student(self):
        return self.student_list[0]


class kahoot_student(models.Model):
    x=models.CharField(max_length=10)

    def __init__(self,name,pin,score):
        self.name=name
        self.pin=pin
        self.score=score

    def enroll(self):
        # kahoot_class.student_list.append((self.name,self.pin,self.score))
        kahoot_class.student_list[self.name]={
            'name':self.name,
            'pin':self.pin,
            'score':self.score
        }

    def return_class_lst(self):
        return kahoot_class.student_list

    def upgrade_stats(self):
        self.score+=1
        return self.score
        










class socket_individual:
    num1=0
    def __init__(self,name,pin):
        self.name=name
        self.pin=pin
        # num=[]

    def increase_num(self):
        kahoot_class.num+=1
        return kahoot_class.num
        # kahoot_class.student_list.append(self.name)

        # return kahoot_class.student_list




class Blitz_Users(models.Model):
    username=models.CharField(max_length=15)
    birthdate=models.DateField()
    email=models.EmailField(max_length=50)
    password=models.CharField(validators=[MinLengthValidator(8)],max_length=20)

class Blitz_Teacher(models.Model):
    username=models.CharField(max_length=15)
    birthdate=models.DateField()
    email=models.EmailField(max_length=50)
    password=models.CharField(validators=[MinLengthValidator(8)],max_length=20)
    quizes=[]

class Quiz(models.Model):
    question = models.CharField(max_length=999)