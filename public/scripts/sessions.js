document.addEventListener('DOMContentLoaded', function() {
    // Saving table state
    let table = document.getElementById('sessionTable');
    table.oldHtml = table.innerHTML;
    refreshTable();
    // Get insert form
    let addSessionForm = document.getElementById('sessionForm');
    // apply insert form event listener
    addSessionForm.addEventListener("submit", addNewSession);
});

function refreshTable() {
    let table = document.getElementById('sessionTable');
    // Removing old rows
    table.innerHTML = table.oldHtml;
    var xhttp = new XMLHttpRequest();
    //alert("test")
    xhttp.open("GET", "/sessionsSel", true);
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
            let del = document.getElementsByClassName('sessionDelete')
            for (let i = 0; i < del.length; i++) {
                del[i].addEventListener("click", delRow)
            };
            let edit = document.getElementsByClassName('sessionsEdit')
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
        <td>${data['sessionID']}</td>\
        <td>${data['employee_id']}</td>\
        <td>${data['client_id']}</td>\
        <td>${data['dog_id']}</td>\
        <td>${data['session_time']}</td>\
        <td>${data['actual_duration']}</td>\
        <td>${data['total_price']}</td>\
        <td>${data['status']}</td>\
        <td><button class="sessionsEdit">Edit</button></td>\
        <td><button type="button" class="sessionDelete">Delete</button></td>\
    </tr>`;
    table.appendChild(newRow);
};

function delRow(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this session?")) {
        let td = event.target.parentNode; 
        let tr = td.parentNode; 
        let data = {
            id: tr.children[0].textContent
        };
        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", '/delete-sessions-ajax/', true);
        xhttp.setRequestHeader("Content-type", "application/json");
    
        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 204) {
                // Remove row from table
                alert('Session has be deleted');
                tr.parentNode.removeChild(tr)
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        };
    
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    };
};

function showEditForm() {
    document.getElementById('editSessionForm').style.display='none';
    document.getElementById('editSessionForm').style.display='block';
}

function populateEditForm(event) {
    event.preventDefault();
    let tr = event.target.parentNode.parentNode; 
    let children = tr.children;
    document.getElementById('editSessionID').textContent = children[0].textContent;
    document.getElementById('editSessionEmployee').value = children[1].textContent;
    document.getElementById('editSessionClient').value = children[2].textContent;
    document.getElementById('editSessionDog').value = children[3].textContent;
    document.getElementById('editSessionTime').value = children[4].textContent.replace(' ', "T");
    document.getElementById('editSessionDuration').value = children[5].textContent.slice(0, -4);
    document.getElementById('editSessionPrice').value = children[6].textContent.slice(1);
    document.getElementById('editSessionStatus').value = children[7].textContent;
    showEditForm('editSessionForm');
}


function addNewSession(event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Get form fields we need to get data from
    let inputEmployee = document.getElementById("employeeID");
    let inputClient = document.getElementById("clientID");
    let inputDog = document.getElementById("dogID");
    let inputTime = document.getElementById("sessionTime");
    let inputDuration = document.getElementById("sessionDuration");
    let inputPrice = document.getElementById("sessionPrice");
    let inputStatus = document.querySelector('input[name="sessionStatus"]:checked');

    // Put our data we want to send in a javascript object
    let data = {        
        employee: inputEmployee.value,
        client: inputClient.value,
        dog: inputDog.value,
        time: inputTime.value,
        duration: inputDuration.value, 
        price: inputPrice.value,
        status: inputStatus.value,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-sessions-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            refreshTable();

            // Clear the input fields for another transaction
            inputEmployee.value = '';
            inputClient.value = '';
            inputDog.value = '';
            inputTime.value = '';
            inputDuration.value= '';
            inputPrice.value = '';
            inputStatus.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
};


let serviceFields = 1
function addService() {
    serviceFields++;
    let services = document.getElementById("serviceEntry");
    let newSelect = document.createElement("div");
    newSelect.innerHTML = '<select name="service_id" id="service_idSelect" required >\
                    <option value="0">Nail Trim</option>\
                    <option value="1">Puppy Cut</option>\
                    <option value="2">Basic Cut: Fluffy Breeds</option>\
                    <option value="3">Basic Cut: Short Coats</option>\
                    </select>';
    newSelect.id = "service_id " + serviceFields
    newSelect.className = "service_id"
    services.appendChild(newSelect); 
}

function removeService() {
    if (serviceFields > 1){
        let services = document.getElementById("serviceEntry");
        let oldSelect = document.getElementById("service_id " + serviceFields);
        
        services.removeChild(oldSelect);
        
        serviceFields--;
    }
}
