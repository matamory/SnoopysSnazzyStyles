
const SERVICE_SELECT = 'SELECT * FROM Services;'

document.addEventListener('DOMContentLoaded', function() {
    let table = document.getElementById('servicesTable');
    table.oldHtml = table.innerHTML;
    refreshTable();
    // Get insert form
    let addServiceForm = document.getElementById('serviceForm');
    // apply insert form event listener
    addServiceForm.addEventListener("submit", addNewService);
    // Get Update form
    let updateServiceForm = document.getElementById('updateServiceForm');
    // apply update form event listener
    updateServiceForm.addEventListener("submit", updateRow);
});

function refreshTable() {
    let table = document.getElementById('servicesTable');
    // Removing old rows
    table.innerHTML = table.oldHtml;
    var xhttp = new XMLHttpRequest();
    //alert("test")
    xhttp.open("GET", "/servicesSel", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //alert(xhttp.responseText);
            let data = JSON.parse(xhttp.responseText)
            // Add the new rows to the table
            for (let i = 0; i < data.length; i++ ) {
                createRow(data[i], table);
            };
            // Updating edit and delete functionalities
            let del = document.getElementsByClassName('serviceDelete')
            for (let i = 0; i < del.length; i++) {
                del[i].addEventListener("click", delRow)
            };
            let edit = document.getElementsByClassName('serviceEdit')
            for (let i = 0; i < del.length; i++) {
                edit[i].addEventListener("click", populateEditForm)
            };
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send();
};

function createRow(data, table) {
    let newRow = document.createElement('tr');

    newRow.innerHTML = `\
    <tr>\
        <td>${data['serviceID']}</td>\
        <td>${data['service_name']}</td>\
        <td>${data['service_duration']/60} min</td>\
        <td>$${data['price']}</td>\
        <td><button class="serviceEdit">Edit</button></td>
        <td><button type="button" class="serviceDelete">Delete</button></td>
    </tr>`;
    table.appendChild(newRow);
};

function addNewService(event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("ServiceName");
    let inputDur = document.getElementById("servDur");
    let inputPrice = document.getElementById("servPrice");

    // Put our data we want to send in a javascript object
    let data = {
        service_name: inputName.value,
        service_duration: inputDur.value * 60,
        price: inputPrice.value,
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-service", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            refreshTable();

            // Clear the input fields for another transaction
            inputName.value = '';
            inputDur.value = '';
            inputPrice.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
};

function delRow(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this service?")) {
        let td = event.target.parentNode; 
        let tr = td.parentNode; 
        let data = {
            id: tr.children[0].textContent
        };
        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", '/delete-service/', true);
        xhttp.setRequestHeader("Content-type", "application/json");
    
        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 204) {
                // Remove row from table
                alert('Service has be deleted');
                tr.parentNode.removeChild(tr);
                document.getElementById('updateServiceForm').style.visibility = 'hidden';
                refreshIntersectionTable();
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        };
    
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    };
};

function updateRow(event){
    event.preventDefault();
    
    // Get form fields we need to get data from
    let updateID = document.getElementById('editServiceID');
    let updateName = document.getElementById("editServiceName");
    let updateDur = document.getElementById("editServiceDuration");
    let updatePrice = document.getElementById("editServicePrice");
    // Put our data we want to send in a javascript object
    let data = {
        id: updateID.textContent,
        service_name: updateName.value,
        service_duration: updateDur.value * 60,
        price: updatePrice.value,
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-service", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            refreshTable();
            // Hiding edit window
            document.getElementById('updateServiceForm').style.visibility = 'hidden';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
};

function showEditForm() {
    document.getElementById('updateServiceForm').style.display='none';
    document.getElementById('updateServiceForm').style.display='block';
    document.getElementById('updateServiceForm').style.visibility = 'visible';
}

function populateEditForm(event) {
    event.preventDefault();
    let tr = event.target.parentNode.parentNode; 
    let children = tr.children;
    document.getElementById('editServiceID').textContent = children[0].textContent;
    document.getElementById('editServiceName').value = children[1].textContent;
    document.getElementById('editServiceDuration').value = children[2].textContent.slice(0, -4);
    document.getElementById('editServicePrice').value = children[3].textContent.slice(1);
    showEditForm();
    document.getElementById('updateServiceForm').scrollIntoView();
}
