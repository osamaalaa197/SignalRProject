var connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub/ChatHub")
    .withAutomaticReconnect([1,1000,5000,null])
    .build();

function addnewRoom(maxroom) {
    var roomName = document.getElementById('createRoomName').value;
    console.log(roomName)
    if (roomName == null && roomName == '') {
        return;
    };

    $.ajax({
            url:
                '/ChatRooms/PostChatRoom',
                dataType:"json",
            // Type of Request
            type: "POST",
            data: JSON.stringify({ id: 0, name: roomName }),
            contentType:"application/json; charset=utf-8",
            success: function (data) {
                let x = JSON.stringify(data);
                connection.invoke("SendAddRoomMessage",maxroom,data.id,data.name)
                roomName = '';
                toastr.success(`Room added successful`);

                console.log(x);
            },

            // Error handling 
            error: function (error) {
                console.log(`Error ${error}`);
            }
        });
}

var create_btn = document.getElementById('btnCreateRoom');
create_btn.addEventListener("click", function () {
    addnewRoom(4)
})

function deleteRoom() {
    let ddlDelRoom = document.getElementById('ddlDelRoom');
    var roomName = ddlDelRoom.options[ddlDelRoom.selectedIndex].text;
    let text = `Do you want to delete Chat Room ${roomName}?`;
    if (confirm(text) == false) {
        return;
    }

    if (roomName == null && roomName == '') {
        return;
    }
    let roomId = ddlDelRoom.value;

    $.ajax({
        url:
            `/ChatRooms/DeleteChatRoom/${roomId}`,
        dataType: "json",
        // Type of Request
        type: "Delete",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            let x = JSON.stringify(data);
            connection.invoke("SendDeleteRoomMessage", data.deleted, data.selected, roomName);
        },

        // Error handling 
        error: function (error) {
            console.log(`Error ${error}`);
        }
    });
}

function sendPublicMessage() {
    const publicMessage = document.getElementById("txtPublicMessage").value;
    const ddlDelRoom = document.getElementById('ddlSelRoom');
    const roomName = ddlDelRoom.options[ddlDelRoom.selectedIndex].text;
    const roomId=ddlDelRoom.value

    connection.send("SendMessagePublic",publicMessage,roomName,Number(roomId))

}

function sendPrivateMessage() {
    const privateMessage = document.getElementById("txtPrivateMessage").value;
    const ddlDelUser = document.getElementById('ddlSelUser');
    const userMail = ddlDelUser.options[ddlDelRoom.selectedIndex].text;
    const userId = ddlDelUser.value
    connection.send("sendPrivateMessage",privateMessage,userId,userMail)
    
}

connection.on("SendMessagePublic", (publicMessage, userId, userName, roomName) => {
    console.log(publicMessage)
    toastr.success(`User send this message ${publicMessage}`);
    addMessage(`[public Message = ${roomName}] [${userName} say ${publicMessage}]`)
})
connection.on("sendPrivateMessage", (privateMessage, UserName, userNameSender) => {
    addMessage(`[Private Message = ] [${userNameSender} to ${UserName} say ${privateMessage}]`)
})


document.addEventListener('DOMContentLoaded', (event) => {
    fillRoomDropDown();
    fillUserDropDown();
})

function fillUserDropDown() {
    $.getJSON('/ChatRooms/GetChatUser')
        .done(function (json) {

            var ddlSelUser = document.getElementById("ddlSelUser");

            ddlSelUser.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");

                newOption.text = item.userName;//item.whateverProperty
                newOption.value = item.id;
                ddlSelUser.add(newOption);


            });

        })
        .fail(function (jqxhr, textStatus, error) {

            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });

}

function fillRoomDropDown() {
    $.getJSON('/ChatRooms/GetChatRoom')
        .done(function (json) {
            var ddlDelRoom = document.getElementById("ddlDelRoom");
            var ddlSelRoom = document.getElementById("ddlSelRoom");

            ddlDelRoom.innerText = null;
            ddlSelRoom.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");

                newOption.text = item.name;
                newOption.value = item.id;
                ddlDelRoom.add(newOption);


                var newOption1 = document.createElement("option");

                newOption1.text = item.name;
                newOption1.value = item.id;
                ddlSelRoom.add(newOption1);

            });

        })
        .fail(function (jqxhr, textStatus, error) {

            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });

}

connection.on("ReceiveUserConnected", (userName, userId,isOldConnection) => {
    console.log(userName);
    if (!isOldConnection) {
        addMessage(`${userName} is online`)
        toastr.success(`${userName} is online`);
    }

})

connection.on("SendAddRoomMessage", (maxRoom, roomId, roomName, userId, userName) => {
    addMessage(`${userName} has created roon ${roomName}`)
    fillRoomDropDown();
})

connection.on("SendDeleteRoomMessage", (roomName, userId, userName) => {
    addMessage(`${userName} has deleted room ${roomName}`)
    fillRoomDropDown();
})

connection.on("ReceiveUserDisConnected", (userName, userId, isOldConnection) => {
    console.log(userName);
    if (!isOldConnection) {
        addMessage(`${userName} is DisConnected`)
        toastr.success(`${userName} is online`);
    }

})
function addMessage(msg) {
    if (msg == null && msg == '') {
        return;
    }
    const ul = document.getElementById("messagesList")
    const li = document.createElement('li');
    li.innerHTML = msg;
    ul.appendChild(li)

}
function fulfilled() {
    console.log("connection Chat send to hub successful")

}
function rejected() {

}
connection.start().then(fulfilled,rejected)