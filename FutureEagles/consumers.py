from channels.consumer import SyncConsumer
from .models import Task
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
        if event[0] == 'change task status': #setup later to change task status between active or non active
            print(f"changing task status where ID is {event[1]} AND {event[2]}")
            # event['text'] = ""
        elif event[0] == 'delete task': #setup later to delete task
            print(f"deleting task where ID is {event[1]} AND {event[2]}")

        elif event[0] == 'edit task': #edits the current task
            print(f"editing task where ID is {event[1]} AND {event[2]}")

        else:
            print(event)
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

        