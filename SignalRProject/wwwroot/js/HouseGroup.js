
var coneection = new signalR.HubConnectionBuilder().withUrl("/hub/HouseGroup").build();
var lbl_houseJoined = document.getElementById("lbl_houseJoined");

var btn_gryffindor = document.getElementById("btn_gryffindor");
var btn_slytherin = document.getElementById("btn_slytherin");
var btn_hufflepuff = document.getElementById("btn_hufflepuff");
var btn_ravenclaw = document.getElementById("btn_ravenclaw");

var btn_un_gryffindor = document.getElementById("btn_un_gryffindor");
var btn_un_slytherin = document.getElementById("btn_un_slytherin");
var btn_un_hufflepuff = document.getElementById("btn_un_hufflepuff");
var btn_un_ravenclaw = document.getElementById("btn_un_ravenclaw");

var trigger_gryffindor = document.getElementById("trigger_gryffindor");
var trigger_slytherin = document.getElementById("trigger_slytherin");
var trigger_hufflepuff = document.getElementById("trigger_hufflepuff");
var trigger_ravenclaw = document.getElementById("trigger_ravenclaw");

btn_gryffindor.addEventListener("click", function (e) {
    coneection.send("JoinGroup", "Gryffindor")
    e.preventDefault();
})
btn_slytherin.addEventListener("click", function (e) {
    coneection.send("JoinGroup", "Slytherin")
    e.preventDefault();
})
btn_hufflepuff.addEventListener("click", function (e) {
    coneection.send("JoinGroup", "Hufflepuff")
    e.preventDefault();
})
btn_ravenclaw.addEventListener("click", function (e) {
    coneection.send("JoinGroup", "Ravenclaw")
    e.preventDefault();
})


//un
btn_un_gryffindor.addEventListener("click", function (e) {
    coneection.send("LeaveGroup", "Gryffindor")
    e.preventDefault();
})
btn_un_slytherin.addEventListener("click", function (e) {
    coneection.send("LeaveGroup", "Slytherin")
    e.preventDefault();
})
btn_un_hufflepuff.addEventListener("click", function (e) {
    coneection.send("LeaveGroup", "Hufflepuff")
    e.preventDefault();
})
btn_un_ravenclaw.addEventListener("click", function (e) {
    coneection.send("LeaveGroup", "Ravenclaw")
    e.preventDefault();
})

coneection.on("UpdateScribtionStatus", (strGroupJoined, houseName, hasScribed) => {
    lbl_houseJoined.innerText = strGroupJoined;
    if (hasScribed) {
        switch (houseName) {
            case "Gryffindor":
                btn_gryffindor.style.display = "none";
                btn_un_gryffindor.style.display = "";
                break;
            case "Slytherin":
                btn_slytherin.style.display = "none";
                btn_un_slytherin.style.display = "";
                break;
            case "Hufflepuff":
                btn_hufflepuff.style.display = "none";
                btn_un_hufflepuff.style.display = "";
                break;
            case "Ravenclaw":
                btn_ravenclaw.style.display = "none";
                btn_un_ravenclaw.style.display = "";
                break;
            default:
                break

        }
        toastr.success(`User has subscribed to ${houseName}`);

    } else {
        switch (houseName) {
            case "Gryffindor":
                btn_gryffindor.style.display = "";
                btn_un_gryffindor.style.display = "none";
                break;
            case "Slytherin":
                btn_slytherin.style.display = "";
                btn_un_slytherin.style.display = "none";
                break;
            case "Hufflepuff":
                btn_hufflepuff.style.display = "";
                btn_un_hufflepuff.style.display = "none";
                break;
            case "Ravenclaw":
                btn_ravenclaw.style.display = "";
                btn_un_ravenclaw.style.display = "none";
                break;
            default:
                break
        }
        toastr.success(`User has Unsubscribed to ${houseName}`);

    }
})

coneection.on("newmemberScribtion", (houseName) => {
    toastr.success(`Hello All User has subscribed to ${houseName}`);

})
coneection.on("lessmemberScribtion", (houseName) => {
    toastr.success(`Hello All User has unsubscribed to ${houseName}`);

})

trigger_gryffindor.addEventListener("click", function (e) {
    coneection.send("TrigerNotification", "Gryffindor");
    e.preventDefault();
});
trigger_hufflepuff.addEventListener("click", function (e) {
    coneection.send("TrigerNotification", "Hufflepuff");
    e.preventDefault();
});
trigger_ravenclaw.addEventListener("click", function (e) {
    coneection.send("TrigerNotification", "Ravenclaw");
    e.preventDefault();
});
trigger_slytherin.addEventListener("click", function (e) {
    coneection.send("TrigerNotification", "Slytherin");
    e.preventDefault();
});

coneection.on("trigerNotification", (houseName) => {
    toastr.success(`Welcome to my  ${houseName}`);

})
function fulfilled() {
    console.log("connection User to hub successful")

}
function rejected() {

}
// start connection
coneection.start().then(fulfilled, rejected)