
let num = 1 //starts list item counter at 1 else gets list item index from backend using if/else statement
const dropContentList = {
    "Edit":"edit task",
    "Change status":"change task status",
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


function openPopup () {
    console.log("here")
    let popupContainer = document.getElementById("popup-container")
    popupContainer.style.display = "flex"
}

function closePopup () {
    let popupContainer = document.getElementById("popup-container")
    popupContainer.style.display = "none"
}

function signedInUser () {

}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        auth2.disconnect();
        document.location='http://localhost:8000/';
    });
}



// const url = "ws://localhost:8000/ws/FutureEagles/"
// const socket = new WebSocket(url);

socket.onopen = function(event) {
    console.log("sockets started")
    console.log('connection is open')
    console.log(event)
    // socket.send('Thanks for connecting')

    // for(let i=0;i<=2;i++){
    //     displayNewTask("sleep","now")
    // } //test the limits of creating task using js dom using automatic data of 100 task

    // socket.send("change task status")

} //when page first opens

socket.onmessage = function(event) {
    console.log('message is recieved')
    // console.log(event['data'])
    // getMe(event['data'])
    // up(event['data'])
    data = event['data']
    console.log(data)
} //when server sends data to frontend

socket.onclose = function(event) {
    console.log('connection is closed')
} //

socket.onerror = function(event) {
    console.log(event)
}


sendTaskData=function(message) {
    // console.log("tester")
    user = document.querySelector('#profile-user').innerText
    task=document.querySelector('#new-task').value
    taskDate=document.querySelector('#task-date').value
    socket.send([message,user,task,taskDate])
    console.log(message,user,task,taskDate)

    closePopup()
    displayNewTask(task,taskDate,num)
    num++
}

testSocket = function(data){
    socket.send(data)
}

function displayNewTask(task,taskDate) {
    let ul = document.querySelector("#list-container")
    let li = document.createElement("li");
    li.id=num //sets the current list item to the index

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
        dropdownLink.id = `${dropContentList[dropdownLink.innerText]},${li.id},${task}` //sets dropdown item element id to object key and gets the current list item index
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
}