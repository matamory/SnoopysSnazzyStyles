
document.addEventListener('DOMContentLoaded', function() {
    // Saving table state
    let table = document.getElementById('clientsDogsTable');
    table.oldHtml = table.innerHTML;
    refreshTable();
    // Get insert form
    let addDogForm = document.getElementById('clientDogForm');
    // apply insert form event listener
    addDogForm.addEventListener("submit", addNewClientDog);
    // Get update form 
    let updateClientDogForm = document.getElementById('update-clientDog-form-ajax');
    updateClientDogForm.addEventListener("submit", updateClientDog);
});

function refreshTable() {
    let table = document.getElementById('clientsDogsTable');
    // Removing old rows
    table.innerHTML = table.oldHtml;
    var xhttp = new XMLHttpRequest();
    //alert("test")
    xhttp.open("GET", "/clientsDogsSel", true);
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
            let del = document.getElementsByClassName('clientsDogDelete')
            for (let i = 0; i < del.length; i++) {
                del[i].addEventListener("click", delRow)
            };
            let edit = document.getElementsByClassName('clientsDogEdit')
            for (let i = 0; i < edit.length; i++) {
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
        <td>${data['clientsDogsID']}</td>\
        <td>${data['client_id']}</td>\
        <td>${data['dog_id']}</td>\
        <td><button class="clientsDogEdit">Edit</button></td>\
        <td><button type="button" class="clientsDogDelete">Delete</button></td>\
    </tr>`;
    table.appendChild(newRow);
};


function delRow(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this client-dog pair?")) {
        let td = event.target.parentNode; 
        let tr = td.parentNode; 
        let data = {
            id: tr.children[0].textContent
        };
        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", '/delete-clientsDogs-ajax/', true);
        xhttp.setRequestHeader("Content-type", "application/json");
    
        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 204) {
                // Remove row from table
                alert('Client-dog pair has been deleted');
                tr.parentNode.removeChild(tr)
                document.getElementById('editClientDogForm').style.visibility = 'hidden';
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        };
    
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    };
};

function populateEditForm(event) {
    event.preventDefault();
    let tr = event.target.parentNode.parentNode; 
    let children = tr.children;
    document.getElementById('editClientDogID').textContent = children[0].textContent;
    document.getElementById('editClient').value = children[1].textContent;
    document.getElementById('editDog').value = children[2].textContent;
    showEditForm('editClientDogForm');
}
function showEditForm() {
    document.getElementById('editClientDogForm').style.display='none';
    document.getElementById('editClientDogForm').style.display='block';
    document.getElementById('editClientDogForm').style.visibility = 'visible';
}

function addNewClientDog(event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Get form fields we need to get data from
    let inputClient = document.getElementById("clientID");
    let inputDog = document.getElementById("dogID");

    // Put our data we want to send in a javascript object
    let data = {
        client: inputClient.value,
        dog: inputDog.value,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-clientsDogs-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            refreshTable();

            // Clear the input fields for another transaction
            inputClient.value = '';
            inputDog.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
};


function updateClientDog(event) {
    event.preventDefault();
    let inputClientDogID = document.getElementById("editClientDogID");
    let inputClientID = document.getElementById("editClient");
    let inputDogID = document.getElementById("editDog");

    // must abort if being passed NULL for dogID

    if (inputClientDogID.textContent === "") {
        return;
      }

    // Put our data we want to send in a javascript object
    let data = {
        clientDogID: inputClientDogID.textContent,
        client: inputClientID.value,
        dog: inputDogID.value,
        
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-clientDog-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            refreshTable();
            document.getElementById('editClientDogForm').style.visibility = 'hidden';
            document.getElementById("editClientDogForm").style.display = "none";

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

}