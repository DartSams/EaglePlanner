
const dropContentList = {
    "Edit":"edit task",
    // "Change status":"change task status",
    "Delete":"delete task"
}
const url = "ws://localhost:8000/ws/FutureEagles/"
const socket = new WebSocket(url);



function showMobileNav() {
    let openSideBar = document.getElementById("sidebar");
    let hamburger = document.getElementById("toggle").children;
    let mainContent = document.getElementById("center");
    if (openSideBar.style.left < "0px") {
        openSideBar.style.left = "0px"
        
        //turn sidebar hamburger into a X
        hamburger.item(2).style.display = "none"
        hamburger.item(0).style.cssText = `
            transform: rotate(45deg) translate(5px, 5px);
            transition: 1s
        `
        hamburger.item(1).style.cssText = `
            transform: rotate(-45deg) ;
            transition: 1s;
        `
        mainContent.style.backgroundColor = "rgba(0,0,0,0.3)"
    } else {
        openSideBar.style.cssText ="left:-310px"

        //turn sidebar X into hamburger
        hamburger.item(2).style.display = "block"
        hamburger.item(0).style.cssText = `
            transform: rotate(0deg);
            transition: 1s
        `
        hamburger.item(1).style.cssText = `
            transform: rotate(0deg);
            transition: 1s;
        `
        mainContent.style.backgroundColor = "white"

    }
}


function openPopup (container,popup,note) {
    // console.log(container)
    // console.log(popup)
    container.style.display = "flex"
    if (popup.id == "list-popup" ) {
        popup.style.cssText = `
            width:300px
        `
    } else if (popup.id == "note-popup") {
        popup.style.cssText = `
            width:80%
        `
        if (note) {
            document.querySelector("#new-note-tag").value = note.id
            document.querySelector("#new-note").value = note.innerText
        }
    }
    
} //opens popup conainer recieved from function parameter

function closePopup (container) {
    // console.log(container)
    container.style.display = "none"
    if (container.className == "popup-to-delete") {
        container.remove()
        return
    } // important to stop creating many popup containers will delete edit popup container from html
    // let popupContainer = document.querySelector("#new-note").value = ""
    else if (container.children[2].id == "note-popup") {
        document.querySelector("#new-note").value = ""
    }
} //closes popup conainer recieved from function parameter




socket.onopen = function(event) {
    console.log("sockets started")
    console.log('connection is open')
    console.log(event)
    socket.send('Thanks for connecting')

    // for(let i=0;i<=100;i++){
    //     displayNewNote("lorem ipsum") //test the limits of creating notes using js dom using automatic data of 100 notes
    //     // displayNewTask("sleep","now") //test the limits of creating task using js dom using automatic data of 100 task
    // } 
} //when page first opens

socket.onmessage = function(event) {
    console.log('message is recieved')
    // console.log(event['data'])
    // getMe(event['data'])
    // up(event['data'])
    data = event['data']
    // console.log(data)
} //when server sends data to frontend

socket.onclose = function(event) {
    console.log('connection is closed')
} //

// socket.onerror = function(event) {
//     console.log(event)
// }


sendTaskData=function(message) {
    // console.log("tester")
    let popupContainer = document.querySelector("#popup-container")
    let user = document.querySelector('.profile-user').innerText
    let user_id = document.querySelector('.profile-user').id
    if (message == "add new task") {
        // user = document.querySelector('.profile-user').innerText
        // user_id = document.querySelector('.profile-user').id
        task=document.querySelector('#new-task').value
        taskDate=document.querySelector('#task-date').value
        socket.send([message,user,user_id,task,taskDate])
        // console.log(message,user,user_id,task,taskDate)
        closePopup(popupContainer)
        displayNewTask(task,taskDate)
    } else if (message == "add new note") {
        let note = document.querySelector("#new-note").value;
        let noteTag = document.querySelector("#new-note-tag").value
        socket.send([message,user,user_id,note,noteTag])
        closePopup(popupContainer)
        displayNewNote(note,noteTag)
    }
}

testSocket = function(data){
    socket.send(data)
    let splitData = data.split(",")
    if (splitData[0] == "delete task") {
        console.log("deleting task")
        document.querySelector(`#${splitData[1]}`).remove()
    } else if (splitData[0] == "edit task") {
        editTaskPopup(splitData)
    }
} //sends data to consumer.py for db queries

function displayNewTask(task,taskDate) {
    let ul = document.querySelector("#list-container")
    let li = document.createElement("li");
    let profile = document.querySelector(".profile-user")
    li.id=task //sets the current list item to the index

    let taskDiv = document.createElement("div");
    taskDiv.id = "task"
    taskDiv.innerText = task
    li.appendChild(taskDiv);

    let dateDiv = document.createElement("div");
    dateDiv.id = "end-date";
    dateDiv.innerText = taskDate
    li.appendChild(dateDiv);

    let statusDiv = document.createElement("div");
    statusDiv.id = "status"
    statusDiv.innerText = "active"
    li.appendChild(statusDiv)

    let dropdown = document.createElement("div");
    dropdown.id = "dropdown"
    let settingsDivContainer = document.createElement("div");
    settingsDivContainer.id = "settings-container"
    let settingsDiv = document.createElement("div");
    settingsDiv.id = "settings"
    for (let i = 0;i <= 2;i++) {
        let span = document.createElement("span");
        settingsDiv.appendChild(span)
    } //creates settings button
    let dropdownContent = document.createElement("div");
    dropdownContent.id = "dropdown-content"
    // dropContentList = ["link 1","link 2","link 3"]
    // for (let j = 0;j<=dropContentList.length-1;j++) {
    //     let dropdownLink = document.createElement("a");
    //     dropdownLink.innerText = dropContentList[j]
    //     console.log(dropContentList[j])
    //     dropdownContent.appendChild(dropdownLink)
    // }


    // dropContentList = {
    //     "link 1":"first",
    //     "link 2":"second",
    //     "link 3":"third"
    // }
    for (const key in dropContentList) {
        let dropdownLink = document.createElement("a");
        dropdownLink.innerText = key
        dropdownLink.id = `${dropContentList[dropdownLink.innerText]},${task},${profile.id}` //sets dropdown item element id to object key and gets the current list item index
        // dropdownLink.id = JSON.stringify({
        //     "backend task":dropContentList[dropdownLink.innerText],
        //     "task id":li.id,
        //     "task":task
        // })
        dropdownLink.addEventListener("click",function(){
            console.log(dropdownLink.id)
            testSocket(dropdownLink.id) 
        }) //when dropdown item clicked it sends data to backend consumer
        dropdownContent.appendChild(dropdownLink)
    } //creates dropdown menu when hovering over settings button

    settingsDivContainer.appendChild(settingsDiv)
    dropdown.appendChild(settingsDivContainer)
    dropdown.appendChild(dropdownContent)
    li.appendChild(dropdown)
    ul.appendChild(li)
} //apends new task to task container

function editTaskPopup(data) {
    // console.log(data)

    const prevData = `${data[1]},${data[2]},${data[3]},${data[4]},${data[5]}`
    const splitPrevData = prevData.split(",")

    let centerDiv = document.querySelector("#center")

    let popupContainer = document.createElement("div");;
    popupContainer.id = "popup-container"
    popupContainer.className = "popup-to-delete"

    let popup = document.createElement("div")
    popup.className = "popup"
    popup.style.width = "300px"

    let popupHeader = document.createElement("div");
    popupHeader.className = "popup-header"
    let closePopupButton = document.createElement("button");
    closePopupButton.innerText = "X"
    closePopupButton.addEventListener("click",function() {
        closePopup(popupContainer)
    })

    let popupBody = document.createElement("div");
    popupBody.className = "popup-body"
    let popupBodyText = document.createElement("h3");
    popupBodyText.innerText = "Edit task below."
    
    let popupFooter = document.createElement("div");
    popupFooter.id = "popup-footer"
    let taskInput = document.createElement("input")
    taskInput.id = "new-task-input"
    taskInput.value = splitPrevData[0]

    let duedateInput = document.createElement("input");
    duedateInput.id = "task-date-input"
    duedateInput.type = "date"
    duedateInput.value = splitPrevData[1]

    let statusInputActive = document.createElement("input");
    statusInputActive.type = "radio"
    statusInputActive.id = "active"
    statusInputActive.value = "active"
    statusInputActive.name = "status"
    let activeLabel = document.createElement("label");
    activeLabel.innerText = "Active"
    activeLabel.htmlFor = "active"

    let statusInputNonActive = document.createElement("input");
    statusInputNonActive.type = "radio"
    statusInputNonActive.id = "non active"
    statusInputNonActive.value = "non active"
    statusInputNonActive.name = "status"
    // statusInputNonActive.checked = true
    let nonactiveLabel = document.createElement("label");
    nonactiveLabel.innerText = "deactivate"
    nonactiveLabel.htmlFor = "non active"

    if (splitPrevData[2] == "active") {
        statusInputActive.checked = true
    } else if (splitPrevData[2] == "non active") {
        statusInputNonActive.checked = true
    }

    let saveButton = document.createElement("button")
    saveButton.innerHTML = "Save"
    saveButton.addEventListener("click",function() {
        saveData(splitPrevData)
        closePopup(popupContainer)
        window.location.reload()
    })

    
    popupHeader.append(closePopupButton)
    popupBody.append(popupBodyText)
    popupFooter.append(taskInput)
    popupFooter.append(duedateInput)
    popupFooter.append(document.createElement("br"))
    popupFooter.append(statusInputActive)
    popupFooter.append(activeLabel)
    popupFooter.append(statusInputNonActive)
    popupFooter.append(nonactiveLabel)
    popupFooter.append(document.createElement("br"))
    popupFooter.append(document.createElement("br"))


    popup.append(popupHeader)
    popup.append(popupBody)
    popup.append(popupFooter)
    popupFooter.append(saveButton)

    popupContainer.append(popup)
    centerDiv.append(popupContainer)

    openPopup(popupContainer,popup)
} //creates a new popup div to edit currently selected task

function saveData(splitPrevData) {

    const radioButtons = document.querySelectorAll("input[name='status']");
    let selectedSize;
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            selectedSize = radioButton.value;
            break;
        }
    }
    const newDataJSON = {
        "task":document.querySelector("#new-task-input").value,
        "due date":document.querySelector("#task-date-input").value,
        "status":selectedSize,
        "user":splitPrevData[4],
        "user id":splitPrevData[5],
    }
    const newData = `${newDataJSON["task"]},${newDataJSON["due date"]},${selectedSize},${splitPrevData[3]},${splitPrevData[4]}`

    testSocket(`finished editing task,${splitPrevData},${newData}`)
    document.querySelector("#new-task-input").value = ""
    document.querySelector("#task-date-input").value = ""
} //sends data to testSocket function with data message of finished editing task so it will send data to consumer.py file for db query to change task entry


function displayNewNote(note,tag) {
    let x = Math.floor(Math.random() * 256);
    let y = 100+ Math.floor(Math.random() * 256);
    let z = 50+ Math.floor(Math.random() * 256);
    if (x && y && z > 240) {
        x-=20;
        y-=30;
        z-=30
    }
    let randomColor = `(${x},${y},${z})`
    // var randomColor = Math.floor(Math.random()*16777215).toString(16); //genereates a random hex color
    console.log(note)
    let notesList = document.querySelector("#notes-list")
    let noteItem = document.createElement("li");
    noteItem.className = `note ${tag}`
    noteItem.style.cssText = `
        background-color:${randomColor}
    `
    // noteItem.style.backgroundColor = "red"
    let preText = document.createElement("pre");
    preText.innerText = note

    noteItem.append(preText)
    notesList.prepend(noteItem)
    // document.querySelector("#new-note").value = ""
} //creates new notes list item with a random background color

function displayTaggedNotes(tag) {
    console.log(`${tag}`)

    if (tag != "all") {
        let noteListReset = document.querySelector("#notes-list").children;
        for (let i = 0;i<noteListReset.length;i++) {
            // console.log(noteList[i].id)
            noteListReset[i].style.display = ""
        } //this is to reset all notes display

        let noteList = document.querySelector("#notes-list").children;
        for (let i = 0;i<noteList.length;i++) {
            // console.log(noteList[i].id)
            if (noteList[i].id != `${tag}`) {
                noteList[i].style.display = "none"
            }
        } //this searches all notes in note list and checks if the id matches the current tag function parameter if not change css style display to none
    } else {
        let noteListReset = document.querySelector("#notes-list").children;
        for (let i = 0;i<noteListReset.length;i++) {
            // console.log(noteList[i].id)
            noteListReset[i].style.display = ""
        } //this is to reset all notes display
    }
}

function selectNote(element) {
    console.log(element)
    let center = document.querySelector("#center")

    let selectedNoteContainer = document.createElement("div");
    selectedNoteContainer.id = "selected-note-container"
    selectedNoteContainer.className = "popup-to-delete"

    let popupNote = document.createElement("div");
    popupNote.id = "selected-note"
    popupNote.style.backgroundColor = element.style.backgroundColor

    let closeNote = document.createElement("div");
    closeNote.id = "close-note"
    closeNote.innerText = "X"
    closeNote.addEventListener("click",function() {
        closePopup(selectedNoteContainer)
    })
    let pre = document.createElement("pre");
    pre.innerText = element.innerText
    let editNoteDiv = document.createElement("div");
    editNoteDiv.id = "selected-note-settings"
    let editNote = document.createElement("button");
    editNote.innerText = "Edit"
    editNote.id = `${document.querySelector(".profile-user").innerText},${document.querySelector(".profile-user").id},${element.innerText},${element.id}`
    editNote.addEventListener("click",function() {
        editNotePopup(editNote.id.split(","))
    })
    let deleteNote = document.createElement("button");
    deleteNote.innerText = "Delete"

    const newDataJSON = {
        "user":document.querySelector(".profile-user").innerText,
        "user id":document.querySelector(".profile-user").id,
        "note":pre.innerHTML,
    }
    deleteNote.addEventListener("click",function() {
        testSocket(`delete note,${newDataJSON["user"]},${newDataJSON["user id"]},${newDataJSON["note"].innerHTML}`)
        element.remove()
        closePopup(selectedNoteContainer)
    })
    popupNote.append(closeNote)
    popupNote.append(pre)
    editNoteDiv.append(editNote)
    editNoteDiv.append(deleteNote)
    popupNote.append(editNoteDiv)
    selectedNoteContainer.append(popupNote)
    center.append(selectedNoteContainer)
} //when clicking on a note opens a popup displaying the note for easier read and allows editing/deleting


function editNotePopup(data) {
    // console.log(data)


    let centerDiv = document.querySelector("#center")

    let popupContainer = document.createElement("div");;
    popupContainer.id = "popup-container"
    popupContainer.className = "popup-to-delete"

    let popup = document.createElement("div")
    popup.className = "popup"
    popup.id = "note-popup"

    let popupHeader = document.createElement("div");
    popupHeader.className = "popup-header"
    let closePopupButton = document.createElement("button");
    closePopupButton.innerText = "X"
    closePopupButton.addEventListener("click",function() {
        closePopup(popupContainer)
    })

    let popupBody = document.createElement("div");
    popupBody.className = "popup-body"
    let popupBodyText = document.createElement("h3");
    popupBodyText.innerText = "Edit task below."
    
    let popupFooter = document.createElement("div");
    popupFooter.id = "popup-footer"
    // let taskInput = document.createElement("input")
    // taskInput.id = "new-task-input"
    // taskInput.value = splitPrevData[0]
    let noteTagInput = document.createElement("input");
    noteTagInput.id = "edited-tag-input"
    noteTagInput.value = data[3]

    let textareaInput = document.createElement("textarea");
    textareaInput.id = "edit-note-input"
    textareaInput.type = "date"
    textareaInput.value = data[2]
    // console.log(splitPrevData[1].id)



    let saveButton = document.createElement("button")
    saveButton.innerHTML = "Save"
    saveButton.id = ""
    saveButton.addEventListener("click",function() {
        saveNoteData(data)
        closePopup(popupContainer)
        window.location.reload()
        // console.log(data)
    })

    
    popupHeader.append(closePopupButton)
    popupBody.append(popupBodyText)

    popupFooter.append(noteTagInput)
    popupFooter.append(textareaInput)
    popupFooter.append(document.createElement("br"))
    popup.append(popupHeader)
    popup.append(popupBody)
    popup.append(popupFooter)
    popupFooter.append(saveButton)

    popupContainer.append(popup)
    centerDiv.append(popupContainer)

    openPopup(popupContainer,popup)
} //creates a new popup div to edit currently selected task

function saveNoteData(prevData) {
    // console.log(`Split data: ${prevData}`)
    
    const newDataJSON = {
        "user":prevData[0],
        "user id":prevData[1],
        "note":document.querySelector("#edit-note-input").value,
        "note_tag":document.querySelector("#edited-tag-input").value,
    }
    const newData = `${newDataJSON["user"]},${newDataJSON["user id"]},${newDataJSON["note"]},${newDataJSON["note_tag"]}`

    testSocket(`finished editing note,${prevData},${newData}`)
    document.querySelector("#edit-note-input").value = ""
    document.querySelector("#edited-tag-input").value = ""
} //saves the new note and sends to the cosnumer.py file with data message of finished editing note

function createMonth(month,day,tasks) {
    // let tasks = ["play games","sleep"]
    let centerDiv = document.querySelector("#center")
    let calendarContainer = document.createElement("div");
    calendarContainer.id = "calendar-container"
    let calendarHeader = document.createElement("div");
    calendarHeader.id = "calendar-header"
    calendarHeader.innerText = `${month} 2022`
    let dayContainer = document.createElement("div");
    dayContainer.id = "days-container"
    let ulDays = document.createElement("ul");
    ulDays.id = "month"
    
    for (let i=1;i<=day;i++) {
        let liDay = document.createElement("li");
        liDay.id = "day"
        // liDay.innerText = "1"

        let dayNum = document.createElement("div");
        dayNum.id = "day-number"
        dayNum.innerText = i
        let dayTask = document.createElement("div");
        dayTask.id = "day-task"
        for (let j=0;j<tasks.length;j++) {
            let task = document.createElement("div");
            task.innerText = tasks[j]
            dayTask.append(task)
        }
        liDay.append(dayNum)
        liDay.append(dayTask)
        ulDays.append(liDay)
    }
    dayContainer.append(ulDays)
    calendarContainer.append(calendarHeader)
    calendarContainer.append(dayContainer)
    centerDiv.append(calendarContainer)
}