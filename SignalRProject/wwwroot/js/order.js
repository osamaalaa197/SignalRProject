var dataTable;
var connection = new signalR.HubConnectionBuilder().withUrl("/hub/OrderHub").build()
$(document).ready(function () {
    loadDataTable();
});

function loadDataTable() {

    dataTable = $('#tblData').DataTable({
        "ajax": {
            "url": "/Home/GetAllOrder"
        },
        "columns": [
            { "data": "id", "width": "5%" },
            { "data": "name", "width": "15%" },
            { "data": "itemName", "width": "15%" },
            { "data": "count", "width": "15%" },
            {
                "data": "id",
                "render": function (data) {
                    return `
                        <div class="w-75 btn-group" role="group">
                        <a href="/Home/GetOrderById?id=${data}"
                        class="btn btn-primary mx-2"> <i class="bi bi-pencil-square"></i> </a>
                      
					</div>
                        `
                },
                "width": "5%"
            }
        ]
    });
}

connection.on("newOrder", function () {
    dataTable.ajax.reload();
    toastr.success(`New Order added`);
})

connection.on("UpdateOrder", (ordername) => {
    dataTable.ajax.reload();
    toastr.success(`Order ${ordername} Updated`);
})

function fulfilled() {

    console.log("connection Order send to hub successful")

}
function rejected() {

}
            connection.start().then(fulfilled,rejected)