var connection = new signalR.HubConnectionBuilder().withUrl("/hub/BasicChat").build()

var btm_sendMessage = document.getElementById("sendMessage");
btm_sendMessage.disabled = true;
btm_sendMessage.addEventListener("click", function (e) {
    var message = document.getElementById("chatMessage").value;
    var sender = document.getElementById("senderEmail").value;
    var received = document.getElementById("receiverEmail").value;
    if (received.length > 0) {
        connection.send("SendMessage",sender,received,message)
    }else{ 
    //send message to all user
    connection.send("PushMessageToAll",sender,message)
    }
    e.preventDefault()

})
connection.on("receivedMessage", (User, message) => {
    console.log(User, message);
    var li = document.createElement('li');
    var element = document.getElementById("messagesList");
    element.appendChild(li);
    li.textContent=`Message from : ${User} - ${message}`
})
function fulfilled() {
    console.log("connection BasicChat send to hub successful")
    btm_sendMessage.disabled = false;


}
function rejected() {

}
connection.start().then(fulfilled,rejected)