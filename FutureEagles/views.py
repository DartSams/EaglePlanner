from django.shortcuts import redirect, render
from django.http import HttpResponse
# from .models import Job
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
@csrf_exempt
def index(request):
    if request.method == "GET":
        # test_task = Job(user="dart",task="sleep",due_date="tonight",status="non active")
        # test_task.save()
        return render(request,"FutureEagles/html/index.html",{})

    else:
        print(request.POST)
        profile = request.POST.get("user")
        request.session["logged-in-user"] = profile
        print(f"Currently logged in as {request.session['logged-in-user']}")
        return redirect("index")


#TODO
    #check consumers.py file