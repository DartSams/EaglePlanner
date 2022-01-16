from django.shortcuts import redirect, render
from django.http import HttpResponse,JsonResponse
from .models import Job,Google_user,Note
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
@csrf_exempt
def index(request,tab="tasks"): #defaults the tab to a empty string if user doesnt pass in a proper tab name such as notes,tasks,calendar
    if request.method == "GET":
        data={
            "current_user":request.session["logged-in-user"],
            "tab":tab
        }
        note_tags=[]
        if request.session["logged-in-user"]:
            if tab == "tasks":
                j = Job.objects.filter(user=request.session["logged-in-user"],user_id=request.session["logged-in-user-id"]) #search job db
                data["user_task"] = j

            elif tab =="notes":
                n = Note.objects.filter(user=request.session["logged-in-user"],user_id=request.session["logged-in-user-id"]) #search note db
                data["user_notes"] = n
                note_tags = set(tag.note_tag for tag in n if tag.note_tag not in note_tags) #searches the notes db for note tags and removes duplicates
                # print(note_tags)
                data["notes_tags"] = note_tags

            elif tab not in ["tasks","notes","calendar"]:
                print("not a valid tab page")

        else:
            print(f"User not logged in.")

        return render(request,"FutureEagles/html/home.html",data)

    else:
        # print(request.POST)
        data_message = request.POST.get("data message")
        profile = request.POST.get("user")
        profile_id = request.POST.get("ID")
        profile_image = request.POST.get("profile image")
        profile_email = request.POST.get("email")

        existing_user = Google_user.objects.filter(user_id=profile_id) #queries the db for all users and finds the user with a specific id returned from ajax call

        try: #first if data from ajax call matches query above then will login user in
            print(f"User found {existing_user[0].profile_name}")
            print(f"{existing_user[0].profile_name} signing in")
            if existing_user[0]:
                request.session["logged-in-user"] = existing_user[0].profile_name
                request.session["logged-in-user-id"] = existing_user[0].user_id

        except: #if data from ajax call doesnt match query then will either sign user out of create new user
            if data_message == "signing out": #if data message in post request says signing out the user will be signed out
                request.session["logged-in-user"] = ""
                request.session["logged-in-user-id"] = ""
                print(f"signing out")
            else: #if data message doesnt say signing out and data from ajax call doesnt match query above this will create new user 
                print(f"User not found creating new user")
                user = Google_user(profile_name=profile,user_id=profile_id,user_image=profile_image,user_email=profile_email)
                user.save()

                new_task = Job(user=profile,user_id=profile_id,task="default",due_date="today",status="active")
                new_task.save()

        # if data_message == "sign in":
        #     profile = request.POST.get("user")
        #     profile_id = request.POST.get("ID")
        #     profile_image = request.POST.get("profile image")
        #     profile_email = request.POST.get("email")
        #     user = Google_user(profile_name=profile,user_id=profile_id,user_image=profile_image,user_email=profile_email)
        #     user.save()
        #     # print(f"User: {user}")
        #     request.session["logged-in-user"] = profile
        #     request.session["logged-in-user-id"] = profile_id
        #     print(f"Currently logged in as {request.session['logged-in-user']}")

        # elif data_message == "create account":
        #     profile = request.POST.get("user")
        #     profile_id = request.POST.get("ID")
        #     profile_image = request.POST.get("profile image")
        #     profile_email = request.POST.get("email")
        #     user = Google_user(profile_name=profile,user_id=profile_id,user_image=profile_image,user_email=profile_email)
        #     user.save()

        # if data_message == "signing out":
        #     request.session["logged-in-user"] = ""
        #     request.session["logged-in-user-id"] = ""
        #     print(f"signing out")


        return redirect("index")

#TODO
    #next start on calendar app
    #fix js using switches instead of if/else if statements