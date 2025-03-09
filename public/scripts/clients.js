
document.addEventListener('DOMContentLoaded', function() {
    // Saving table state
    let table = document.getElementById('clientTable');
    table.oldHtml = table.innerHTML;
    refreshTable();
    // Get insert form
    let addClientForm = document.getElementById('clientForm');
    // apply insert form event listener
    addClientForm.addEventListener("submit", addNewClient);
});

function refreshTable() {
    let table = document.getElementById('clientTable');
    // Removing old rows
    table.innerHTML = table.oldHtml;
    var xhttp = new XMLHttpRequest();
    //alert("test")
    xhttp.open("GET", "/clientsSel", true);
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
            let del = document.getElementsByClassName('clientsDelete')
            for (let i = 0; i < del.length; i++) {
                del[i].addEventListener("click", delRow)
            };
            let edit = document.getElementsByClassName('clientsEdit')
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
        <td>${data['clientID']}</td>\
        <td>${data['name']}</td>\
        <td>${data['phone_number']}</td>\
        <td>${data['contact_method']}</td>\
        <td>${data['email']}</td>\
        <td><button class="clientsEdit">Edit</button></td>\
        <td><button type="button" class="clientsDelete">Delete</button></td>\
    </tr>`;
    table.appendChild(newRow);
};

function delRow(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this client?")) {
        let td = event.target.parentNode; 
        let tr = td.parentNode; 
        let data = {
            id: tr.children[0].textContent
        };
        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", '/delete-client-ajax/', true);
        xhttp.setRequestHeader("Content-type", "application/json");
    
        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 204) {
                // Remove row from table
                alert('Client has be deleted');
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
    document.getElementById('editClientForm').style.display='none';
    document.getElementById('editClientForm').style.display='block';
}

function populateEditForm(event) {
    event.preventDefault();
    let tr = event.target.parentNode.parentNode; 
    let children = tr.children;
    document.getElementById('editClientID').textContent = children[0].textContent;
    document.getElementById('editClientName').value = children[1].textContent;
    document.getElementById('editClientPhone').value = children[2].textContent;
    let sel = (children[3].textContent === 'Call') ? 0: 1;
    document.getElementById('editClientContact').value = sel;
    document.getElementById('editClientEmail').value = children[4].textContent;
    showEditForm('editClientForm');
}

function addNewClient(event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("clientName");
    let inputPhone = document.getElementById("clientPhone");
    let inputContact = document.querySelector('input[name="contactMethod"]:checked');
    let inputEmail = document.getElementById("clientEmail");

    inputContact = inputContact ? inputContact.value : 'null';

    // Put our data we want to send in a javascript object
    let data = {
        name: inputName.value,
        phone: inputPhone.value,
        contact: (inputContact.trim() == "") ? 'null': inputContact,
        email: (inputEmail.value.trim() == "") ? 'null': inputEmail.value
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-client-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            refreshTable();

            // Clear the input fields for another transaction
            inputName.value = '';
            inputPhone.value = '';
            inputContact.value = '';
            inputEmail.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
};   
