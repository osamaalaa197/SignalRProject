var cloakSpan = document.getElementById("cloakCounter");
var stoneSpan = document.getElementById("stoneCounter");
var wandSpan = document.getElementById("wandCounter");

//create connection
var connectionToHub = new signalR.HubConnectionBuilder().withUrl("/hub/DealthyHallowRace").build();
//connect to method that make in hup
connectionToHub.on("UpdateDealthyHallowRace", (cloak, stone, wand) => {
    cloakSpan.innerHTML = cloak.toString()
    stoneSpan.innerHTML = stone.toString()
    wandSpan.innerHTML = wand.toString()
})

//invoke hub method 
//function newWindowloaded () {
//    connectionToHub.send("NewPageLoaded")
//}

function fulfilled() {
    connectionToHub.invoke("VotingDealthyHallowRace").then((record) => {
        cloakSpan.innerHTML = record.cloak.toString()
        stoneSpan.innerHTML = record.stone.toString()
        wandSpan.innerHTML = record.wand.toString()
    })
    console.log("connection User to hub successful")

}
function rejected() {

}
// start connection
connectionToHub.start().then(fulfilled,rejected)
