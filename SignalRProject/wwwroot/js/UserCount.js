
//create connection
var connectionToHub = new signalR.HubConnectionBuilder().withUrl("hub/userCount").build();
//connect to method that make in hup
connectionToHub.on("UpdateUserCount", (value) => {
    var UserCount = document.getElementById("totalCountView");
    UserCount.innerText=value.toString()
})
connectionToHub.on("UpdateTotalUser", (value) => {
    console.log(value)
    var element = document.getElementById("totalUserCount");
    element.innerText = value.toString()
})
//invoke hub method 
function newWindowloaded () {
    connectionToHub.send("NewPageLoaded")
}

function fulfilled() {
    newWindowloaded();
    console.log("connection User to hub successful")

}
function rejected() {

}
// start connection
connectionToHub.start().then(fulfilled,rejected)
