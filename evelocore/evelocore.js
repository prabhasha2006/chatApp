const lowerCase = (text) => {
    return text.replace(/ /gi,'').toLowerCase()
}
let onMonitoring = true
let unreads = 0
let chatSound = new Audio('./recieveOn.mp3')
let onServer = false
const socket = io()
const sendMessage = (msg) => {
    if(msg.replace(/ /gi,"").length == 0){
        alert("Can't send empty messages!!!")
        return
    }
    var textChat = document.getElementsByClassName("chatBody")[0]
    textChat.innerHTML += `
    <div class="messages sentMsg">
        <div class="Content">
            <p>${msg}</p>
        </div>
    </div>`
    messageInput.value = ""
    textChat.scrollTo(0, textChat.scrollHeight);
    // Emit a custom event to the server
    socket.emit('server-message', 
    { 
        from : emits.value || "a",
        to: listens.value || "b",
        isOnServer: onServer,
        message: msg
    })
    chatSound.play()
}
socket.on('client-message', (data) => {
    if(onServer){
        if(!data.isOnServer){return}
        if(data.to === listens.value){
            if(data.from === emits.value){
                return
            }
            var textChat = document.getElementsByClassName("chatBody")[0]
            textChat.innerHTML += `
            <div class="messages recievedMsg">
                <div class="Content">
                <h5>${data.from}</h5>
                <p>${data.message}</p>
                </div>
            </div>`
            if(!onMonitoring){
                unreads++
                title.innerHTML = listens.value.toUpperCase() + " Server (" +unreads+ ")"
            }
            chatSound.play()
        }
    }else{
        if(data.isOnServer){return}
        if(data.to === emits.value){
            if(data.from === listens.value){
                var textChat = document.getElementsByClassName("chatBody")[0]
                textChat.innerHTML += `
                <div class="messages recievedMsg">
                    <div class="Content">
                        <p>${data.message}</p>
                    </div>
                </div>`
                textChat.scrollTo(0, textChat.scrollHeight);
                if(!onMonitoring){
                    unreads++
                    title.innerHTML = listens.value.toUpperCase() + " New (" +unreads+ ")"
                }
                chatSound.play()
                //console.log('Received :', data.message);
            }else{
                eveloCoreAlert("New Message From "+data.from.toUpperCase(), data.from, data.message, '#55f', 10000)
            }
        }
    }
    //console.log(data)
})
messageInput.addEventListener('keydown', (event) => {
if (event.key === 'Enter') {
    sendMessage(messageInput.value)
    // Perform desired actions here
}
})
if(document.addEventListener){
    document.addEventListener("visibilitychange", function(event) {
        //console.log(event)
        if(document.visibilityState == 'hidden') {
            // page is hidden
            console.log("onMonitoring = false")
            onMonitoring = false
            chatSound = new Audio('./recieveOff.mp3')
        } else {
            // page is visible
            console.log("onMonitoring = true")
            unreads = 0
            onMonitoring = true
            chatSound = new Audio('./recieveOn.mp3')
            title.innerHTML = listens.value.toUpperCase() + " ONLINE"
        }
    });
}
//notify
const eveloCoreAlert = (msg,returnData,returnMessage,colour,duration) => {
    duration = duration || 10000
    var notificationContain = document.getElementsByClassName("primary-notification")[0]
    if(!msg){
        notificationContain.classList.remove("primary-notification-popup")
        return
    }
    var notification = document.getElementById("primary-notification-text")
    notification.innerHTML = msg
    var notification = document.getElementById("primary-notification-head")
    notification.style.color = colour
    var notification = document.getElementById("primary-notification-got")
    notification.style.color = colour
    notification = document.getElementsByClassName("primary-notification-contain")[0]
    notification.style.border = "4px solid "+colour
    notification.style.borderLeft = "10px solid "+colour
    //notification.style.boxShadow = "00 1px 5px 1px "+colour
    notificationContain.classList.add("primary-notification-popup")
    setTimeout(eveloCoreAlert,duration)
    document.getElementById("primary-notification-cancel").addEventListener("click", ()=>{ eveloCoreAlert() })
    document.getElementById("primary-notification-got").addEventListener("click", ()=>{ 
        var textChat = document.getElementsByClassName("chatBody")[0]
        textChat.innerHTML = `
        <div class="messages holdingdMsg">
            <div class="Content">
            <p>Fast chat app with web socket by <b>Kumuthu Prabhasha.</b> V4.9</p>
            </div>
        </div>
        <div class="messages recievedMsg">
            <div class="Content">
                <p>${returnMessage}</p>
            </div>
        </div>`
        messageInput.value = ""
        listens.value = returnData
        theirName.innerHTML = returnData
     })
    if(!onMonitoring){
        title.innerHTML = returnData.toUpperCase() + " is inviting..."
    }
    chatSound.play()
}
const chatServerOpen = (btn) => {
    if(!onServer){
        btn.innerText = "Join A Personal Chat"
        serverLabel.innerHTML = "Server"
        onServer = true
    }else{
        btn.innerText = "Join A Chat Server"
        serverLabel.innerHTML = "Client"
        onServer = false
    }
}
const enterChat = () => {
    document.getElementsByClassName('homescreen')[0].style.display = 'none'
    var textChat = document.getElementsByClassName("chatBody")[0]
    if(onServer){
        textChat.innerHTML = `
        <div class="messages holdingdMsg">
            <div class="Content">
            <p>Fast chat app with web socket by <b>Kumuthu Prabhasha.</b> V4.9</p>
            </div>
        </div>
        <div class="messages holdingdMsg">
            <div class="Content">
            <p>You are on a server chat</p>
            </div>
        </div>`
    }else{
        textChat.innerHTML = `
        <div class="messages holdingdMsg">
            <div class="Content">
            <p>Fast chat app with web socket by <b>Kumuthu Prabhasha.</b> V4.9</p>
            </div>
        </div>`
    }
}