document.addEventListener('DOMContentLoaded', function() {
    // Saving table state
    let table = document.getElementById('sessionTable');
    table.oldHtml = table.innerHTML;
    table = document.getElementById('sessionServiceTable');
    table.oldHtml = table.innerHTML;
    table = document.getElementById('service');
    table.oldHtml = table.innerHTML;
    table = document.getElementById('sessionID');
    table.oldHtml = table.innerHTML;
    refreshTable();
    // Get insert form
    let addSessionForm = document.getElementById('sessionForm');
    // apply insert form event listener
    addSessionForm.addEventListener("submit", addNewSession);
    // Get insert form
    let addSessionServiceForm = document.getElementById('sessionServiceForm');
    // apply insert form event listener
    addSessionServiceForm.addEventListener("submit", addNewSessionService);
    setDropdowns();
    // Get update form 
    let updateSessionForm = document.getElementById('update-session-form-ajax');
    updateSessionForm.addEventListener("submit", updateSession);
});

function refreshTable() {
    let table = document.getElementById('sessionTable');
    // Removing old rows
    table.innerHTML = table.oldHtml;
    refreshDropdowns();
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
            for (let i = 0; i < edit.length; i++) {
                edit[i].addEventListener("click", populateEditForm)
            };
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send();

    refreshIntersectionTable();
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
                tr.parentNode.removeChild(tr);
                document.getElementById('editSessionForm').style.visibility = 'hidden';
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

function refreshIntersectionTable() {
    let table = document.getElementById('sessionServiceTable');
    // Removing old rows
    table.innerHTML = table.oldHtml;
    // Get SessionServices rows
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/sessionServicesSel", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //alert(xhttp.responseText);
            let data = JSON.parse(xhttp.responseText)
            // Add the new rows to the table
            for (let i = 0; i < data.length; i++ ) {
                createIntersectionRow(data[i], table);
            };
            // Updating edit and delete functionalities
            let del = document.getElementsByClassName('sessionServiceDelete')
            for (let i = 0; i < del.length; i++) {
                del[i].addEventListener("click", delIntersectionRow)
            };
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send();
};

function createIntersectionRow(data, table) {
    let newRow = document.createElement('tr');
    newRow.innerHTML = `\
    <tr>\
        <td>${data['session_id']}</td>\
        <td>${data['service_name']}</td>\
        <td><button type="button" class="sessionServiceDelete">Delete</button></td>\
    </tr>`;
    table.appendChild(newRow);
};

function delIntersectionRow(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this session's Service?")) {
        let td = event.target.parentNode; 
        let tr = td.parentNode; 
        let data = {
            session_id: tr.children[0].textContent,
            service_name: tr.children[1].textContent
        };
        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", '/delete-sessionService/', true);
        xhttp.setRequestHeader("Content-type", "application/json");
    
        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 204) {
                // Remove row from table
                alert('Service has been deleted');
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
    document.getElementById('editSessionForm').scrollIntoView();
}

function setDropdowns() { //Function for dropdowns that do not need refreshing
    // Get dropdowns
    let service_dd = document.getElementById('service');
    let service1_dd = document.getElementById('service_idSelect');
    
    // Query new data
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/serviceDropdown", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //alert(xhttp.responseText);
            let data = JSON.parse(xhttp.responseText)
            // Add the new rows to the table
            for (let i = 0; i < data.length; i++ ) {
                // Reassign dropdown values
                let newRow = document.createElement('option');
                newRow.value = data[i]['serviceID'];
                newRow.textContent = data[i]['service_name'];
                service_dd.appendChild(newRow);
                service1_dd.appendChild(newRow.cloneNode(true));
            };

            // Saving service select state
            table = document.getElementById('serviceEntry');
            table.oldHtml = table.innerHTML;
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send();
};

function refreshDropdowns() {
    // Clear dropdown
    let dd = document.getElementById('sessionID');
    dd.innerHTML = dd.oldHtml;

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/sessionDropdown", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //alert(xhttp.responseText);
            let data = JSON.parse(xhttp.responseText)
            // Add the new rows to the table
            for (let i = 0; i < data.length; i++ ) {
                let newRow = document.createElement('option');
                newRow.textContent = data[i]['sessionID'];
                dd.appendChild(newRow);
            };
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send();
};

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
            // Getting id from submitted data
            let data = JSON.parse(xhttp.responseText)
            let services = getServices();
            
            // Adding new services to session
            for (const service of services) {
                addNewSessionServices(data[0]["MAX(sessionID)"], service);
            }

            // Add the new data to the table
            refreshTable();

            // Clear the input fields for another transaction
            document.getElementById("serviceEntry").innerHTML = document.getElementById("serviceEntry").oldHtml;
            serviceFields = 1;
            inputEmployee.value = 0;
            inputClient.value = 0;
            inputDog.value = 0;
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

function getServices(){
    let services = document.getElementsByName("s");
    let serviceSet = new Set();
    console.log(services);
    for (let i = 0; i < services.length; i++){
        if (services[i].value != 0){
            serviceSet.add(services[i].value);
        };
    };
    return serviceSet;
}

function addNewSessionService(event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Get form fields we need to get data from
    let inputSessionID = document.getElementById("sessionID");
    let inputService = document.getElementById("service");

    // Put our data we want to send in a javascript object
    let data = {        
        session_id: inputSessionID.value,
        service_id: inputService.value
    }

    // Setup our request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-sessionsService", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            refreshIntersectionTable();

            // Clear the input fields for another transaction
            inputSessionID.value = 0;
            inputService.value = 0;
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
};

function addNewSessionServices(sessionID, serviceID) { //Function for adding multiple for those in sessions input

    // Put our data we want to send in a javascript object
    let data = {        
        session_id: sessionID,
        service_id: serviceID
    }

    // Setup our request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-sessionsService", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
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
    let queriedServices = document.getElementById("service");
    `newSelect.innerHTML = '<select name="service_id" id="service_idSelect" required >\
                    <option value="0">Nail Trim</option>\
                    <option value="1">Puppy Cut</option>\
                    <option value="2">Basic Cut: Fluffy Breeds</option>\
                    <option value="3">Basic Cut: Short Coats</option>\
                    </select>';`
    newSelect.appendChild(queriedServices.cloneNode(true));
    newSelect.id = "service_id " + serviceFields
    newSelect.className = "service_id"
    newSelect.childNodes[0].id = 's'
    newSelect.childNodes[0].name = 's'
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

function updateSession(event){
    event.preventDefault();
    
    // Get form fields we need to get data from
    let updateSessionID = document.getElementById('editSessionID');
    let updateEmployee = document.getElementById("editSessionEmployee");
    let updateClient = document.getElementById("editSessionClient");
    let updateDog = document.getElementById("editSessionDog");
    let updateTime = document.getElementById("editSessionTime");
    let updateDuration = document.getElementById("editSessionDuration");
    let updatePrice = document.getElementById("editSessionPrice");
    let updateStatus = document.getElementById("editSessionStatus");
   

    if (updateSessionID.textContent === "") {
        return;
      }

    // Put our data we want to send in a javascript object
    let data = {
        id: updateSessionID.textContent,
        employee: updateEmployee.value,
        client: updateClient.value,
        dog: updateDog.value, 
        time: updateTime.value,
        duration: updateDuration.value,
        price: updatePrice.value,
        stat: updateStatus.value,

    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-session-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            refreshTable();
            // Hiding edit window
            document.getElementById('editSessionForm').style.visibility = 'hidden';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
};
