from channels.consumer import SyncConsumer
from .models import Job
import json

class EchoConsumer(SyncConsumer):
    def websocket_connect(self,event):
        print("connect event is on")
        print(event)
        self.send({
            'type':'websocket.accept'
        })

    def websocket_receive(self,event):
        event = event['text'].split(",")
        # print(event)
        if event[0] == 'add new task':
            new_task = Job(user=event[1],user_id=event[2],task=event[3],due_date=event[4],status="active")
            new_task.save()
            print(f"***Creating new task: {event}***")

        elif event[0] == 'change task status': #setup later to change task status between active or non active
            print(f"***changing task status where task is {event[1]} by {event[2]}***")
            # event['text'] = ""

        elif event[0] == 'delete task': #setup later to delete task
            try:
                task=Job.objects.filter(task=event[1],user_id=event[5],due_date=event[2],status=event[3])
                task.delete()
                print(f"***deleting task where task is {event[1]} by {event[2]}***")
            except:
                print("delete failed")

        elif event[0] == 'finished editing': #edits the current task
            print(event)
            # print(f"***editing task where task is {event[1]} by {event[2]}***")

        # else:
        #     print(event)
            # event=event['text'].split(",")
            # task=event[0]
            # date=event[1]
            # a=Task(user="dart",task=task,due_date=date,status="active")
            # a.save()
            # print(f"Event: {event}")

            # task_data={
            #     'name':a.user,
            #     'task':a.task,
            # }
            # self.send({
            #     'type':'websocket.send',
            #     'text':json.dumps(task_data)
            # }) #sends data to js frontend in socket.onmessage function

    def websocket_disconnect(self,event):
        print("connection is disconnected")
        print(event)

        