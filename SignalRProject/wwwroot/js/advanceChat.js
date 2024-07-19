var connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub/ChatHub")
    .withAutomaticReconnect([1, 1000, 5000, null])
    .build();
function addnewRoom() {
    let roomName = prompt("What will your chat room name be?\r\nIf you leave it blank, a name will be generated automatically!!");
    if (roomName == null) {
        return;
    }

    $.ajax({
        url:
            '/ChatRooms/PostChatRoom',
        dataType: "json",
        // Type of Request
        type: "POST",
        data: JSON.stringify({ id: 0, name: roomName }),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            let x = JSON.stringify(data);
            connection.invoke("SendAddRoomMessage", maxroom, data.id, data.name)
            roomName = '';
            window.location.reload();
        },

        // Error handling 
        error: function (error) {
            console.log(`Error ${error}`);
        }
    });
}
connection.on("SendAddRoomMessage", (maxRoom, roomId, roomName, userId, userName) => {
    toastr.success(`Room added successful`);

})


function deleteRoom(roomId, roomName) {
    let text = `Do you want to delete Chat Room ${roomName}?`;
    if (confirm(text) == false) {
        return;
    }

    if (roomName == null && roomName == '') {
        return;
    }
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
connection.on("SendDeleteRoomMessage", (roomName, userId, userName) => {
    toastr.success(`Room deleted successful`);

})

function sendpublicMessage(roomId) {
    var publicMessage = document.getElementById(`inputMessage${roomId}`).value;
    connection.invoke("SendMessagePublic",publicMessage,"",Number(roomId))
    publicMessage = "";
}
function receivepublicMessage(roomId,message,username,userId) {
    let ulmessagesList = document.getElementById(`ulmessagesList${roomId}`);

    let li = document.createElement("li");
    let newmsg = document.createElement("p");

    if (userId == document.getElementById("hdUserId").value || document.getElementById("hdUserId").value == '') {
        newmsg.innerHTML = `${username} says ${message}`;
    }
    else {
        newmsg.innerHTML = `<i role="button" class="bi bi-arrow-right-circle text-primary" onclick="openprivateChat('${userId}','${username}')"> </i> ${username} says ${message}`;
    }



    li.appendChild(newmsg);
    ulmessagesList.appendChild(li);

    li.scrollIntoView(false);
    li.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

}
function readypublicMessage(roomId) {

    let inputMsg = document.getElementById(`inputMessage${roomId}`);
    let sendButton = document.getElementById(`btnMessage${roomId}`);

    if (inputMsg.value.length == 0) {
        sendButton.disabled = true;
    } else {
        sendButton.disabled = false;
    }
}
connection.on("SendMessagePublic", (publicMessage, userId, userName, roomName,roomId) => {

    //toastr.success(`User send this message ${publicMessage}`);
    receivepublicMessage(roomId,publicMessage,userName,userId)

})




// Open private
function receiveopenprivateChat(userId, userName, tabchange) {

    let pubtab = document.getElementById('public-tab');
    let pribtab = document.getElementById('private-tab');

    let pubtabbox = document.getElementById('publictabbox');
    let pribtabbox = document.getElementById('privatetabbox');

    if (tabchange) {

        pubtab.classList.remove('active');
        pribtab.classList.add('active');

        pubtabbox.classList.remove('show');
        pubtabbox.classList.remove('active');

        pribtabbox.classList.add('show');
        pribtabbox.classList.add('active');
    }

    document.getElementById('hdchatUserId').value = userId;

    let div = document.getElementById("list-tab");

    var newa = document.getElementById(`list-${userId}-list`);
    if (typeof (newa) != 'undefined' && newa != null) {
        // Exists.
        newa.classList.add('active');
    }
    else {

        var children = div.children;
        for (var i = 0; i < children.length; i++) {
            children[i].classList.remove('active');
        }

        newa = document.createElement("a");

        newa.classList.add('list-group-item');
        newa.classList.add('list-group-item-action');
        newa.classList.add('active');

        newa.setAttribute("id", `list-${userId}-list`);

        newa.setAttribute("data-bs-toggle", `list`);
        newa.setAttribute("href", `#list-${userId}`);
        newa.setAttribute("role", `tab`);
        newa.setAttribute("aria-controls", `list-${userId}`);

        newa.setAttribute("onclick", `setchatuserId('${userId}')`);

        newa.innerHTML = `<div class="row">
                        <div class="col"> 
                            <i role="button" class="bi bi-x-lg" title="Close chat" onclick="deleteprivatechatGroup('${userId}')"> </i> ${userName}
                        </div>
                        <div class="col-auto">
                            <i class="block-text align-middle bg-success rounded-circle"
                                id="spanOnline${userId}" style="margin-left:5px;" title="Online">
                                </i>
                        </div>
                    </div>`;

        div.appendChild(newa);
    }

    let div1 = document.getElementById("nav-tabContent");

    var div2 = document.getElementById(`list-${userId}`);

    if (typeof (div2) != 'undefined' && div2 != null) {
        // Exists.
        div2.classList.add('active');
        div2.classList.add('show');
    }
    else {


        var children = div1.children;
        for (var i = 0; i < children.length; i++) {
            children[i].classList.remove('active');
            children[i].classList.remove('show');
        }

        div2 = document.createElement("div");

        div2.classList.add('tab-pane');
        div2.classList.add('fade');
        div2.classList.add('active');
        div2.classList.add('show');

        div2.setAttribute("id", `list-${userId}`);

        div2.setAttribute("aria-labelledby", `list-${userId}-list`);
        div2.setAttribute("role", `tabpanel`);

        div2.innerHTML = `<div style="overflow: hidden;"> 
                        <div class="d-block px-2 pb-2"  style="overflow-y:auto; max-height:400px">  
                            <ul class="p-2" style="list-style-type:none;" id="ulmessagesList${userId}">

                            </ul>
                        </div>
                    </div>`;

        div1.appendChild(div2);
    }
}
function openprivateChat(userId, userName) {
    connection.invoke("SendOpenPrivateChat", userId);
    receiveopenprivateChat(userId,userName,true)
}
connection.on("SendOpenPrivateChat", (senderId,senderUserName) => {
    receiveopenprivateChat(senderId,senderUserName)
})

//Send Private
function sendprivateMessage()

function fulfilled() {
    console.log("connection Chat adv.. send to hub successful")

}
function rejected() {

}
connection.start().then(fulfilled, rejected)