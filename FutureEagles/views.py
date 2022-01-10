from django.shortcuts import redirect, render
from django.http import HttpResponse
from .models import Job,Google_user
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
@csrf_exempt
def index(request):
    if request.method == "GET":
        # test_task = Job(user="dart",task="sleep",due_date="tonight",status="non active")
        # test_task.save()
        try:
            j = Job.objects.filter(user=request.session["logged-in-user"])
            for task_entry in j:
                print(f"Entry: {task_entry.user},{task_entry.task},{task_entry.due_date},{task_entry.status}")
        except:
            print(f"task not found by {request.session['logged-in-user']}")

        data={
            "current_user":request.session["logged-in-user"]
        }
        # print(data["current_user"])
        return render(request,"FutureEagles/html/index.html",data)

    else:
        print(request.POST)
        data_message = request.POST.get("data message")

        if data_message == "sign in":
            profile = request.POST.get("user")
            profile_id = request.POST.get("ID")
            profile_image = request.POST.get("profile image")
            profile_email = request.POST.get("email")
            user = Google_user(user_profile=profile,user_id=profile_id,user_image=profile_image,user_email=profile_email)
            user.save()
            # print(f"User: {user}")
            request.session["logged-in-user"] = profile
            print(f"Currently logged in as {request.session['logged-in-user']}")
        
        elif data_message == "signing out":
            profile = request.POST.get("user")
            request.session["logged-in-user"] = profile
            print(f"signing out")

        return redirect("index")


#TODO
    #check consumers.py file