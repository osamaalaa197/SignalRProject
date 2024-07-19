var connection = new signalR.HubConnectionBuilder().withUrl("/hub/Notification").build();

var btm = document.getElementById("sendButton");
btm.disabled = true

btm.addEventListener("click", function (e) {
    var messageValue = document.getElementById("notificationInput").value
    console.log(messageValue)
    connection.send("PushNotifcation", messageValue)
    e.preventDefault()
})
connection.on("UserPushNotification", (ListOfnotitfcation) => {
    var notificationCounter = document.getElementById("notificationCounter");
    notificationCounter.innerText = ListOfnotitfcation.length; 

    ListOfnotitfcation.forEach((e) => {
        $('ul.notification-menu').append('<li><a class="dropdown-item" href="#">' + e + '</a></li>');
    });
    toastr.success(`Notification added successful`);

})
function fulfilled() {

    console.log("connection Notification send to hub successful")

}
function rejected() {

}
connection.start().then(function () {
    btm.disabled = false
    connection.send("LoadMessage")
})