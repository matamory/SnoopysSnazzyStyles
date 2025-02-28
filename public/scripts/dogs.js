//var fetch = require("node-fetch");

document.addEventListener('DOMContentLoaded', function() {
    let table = document.getElementById('dogTable');
    table.oldHtml = table.innerHTML;
    refreshTable();
    // Get the objects we need to modify
    let addDogForm = document.getElementById('dogForm');
    
    // Modify the objects we need
    addDogForm.addEventListener("submit", addNewDog);
});

function refreshTable() {
    let table = document.getElementById('dogTable');
    // Removing old rows
    table.innerHTML = table.oldHtml;
    var xhttp = new XMLHttpRequest();
    //alert("test")
    xhttp.open("GET", "/dogsSel", true);
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
            let del = document.getElementsByClassName('dogDelete')
            for (let i = 0; i < del.length; i++) {
                del[i].addEventListener("click", delRow)
            };
            let edit = document.getElementsByClassName('dogsEdit')
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
        <td>${data['dogID']}</td>\
        <td>${data['name']}</td>\
        <td>${data['age']}</td>\
        <td>${data['breed']}</td>\
        <td>${data['size_lbs']}</td>\
        <td>${data['groomer_notes']}</td>\
        <td><button class="dogsEdit">Edit</button></td>\
        <td><button type="button" class="dogDelete">Delete</button></td>\
    </tr>`;
    table.appendChild(newRow);
};

function delRow(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this dog?")) {
        let td = event.target.parentNode; 
        let tr = td.parentNode; 
        let link = '/delete-dog-ajax/';
        let data = {
            id: tr.children[0].value
        };
    
        $.ajax({
            url: link,
            type: 'DELETE',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function(result) {
                tr.parentNode.removeChild(tr);
            }
        });
    };
};

function showEditForm() {
    document.getElementById('editDogForm').style.display='none';
    document.getElementById('editDogForm').style.display='block';
}

function populateEditForm(event) {
    event.preventDefault();
    let tr = event.target.parentNode.parentNode; 
    let children = tr.children;
    document.getElementById('editDogID').textContent = children[0].textContent;
    document.getElementById('editDogName').value = children[1].textContent;
    document.getElementById('editDogAge').value = children[2].textContent;
    document.getElementById('editDogBreed').value = children[3].textContent;
    document.getElementById('editDogSize').value = children[4].textContent;
    document.getElementById('editDogNotes').value = children[5].textContent;
    showEditForm('editDogForm');
}

function addNewDog(event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("dogName");
    let inputAge = document.getElementById("dogAge");
    let inputBreed = document.getElementById("dogBreed");
    let inputSizeLbs = document.getElementById("dogSize");
    let inputGroomerNotes = document.getElementById("dogNotes");

    // Put our data we want to send in a javascript object
    let data = {
        name: inputName.value,
        age: inputAge.value,
        breed: (inputBreed.value.trim() == "") ? 'null': inputBreed.value,
        size_lbs: inputSizeLbs.value,
        groomer_notes: (inputGroomerNotes.value.trim() == "") ? 'null': inputGroomerNotes.value
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-dog-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            refreshTable();

            // Clear the input fields for another transaction
            inputName.value = '';
            inputAge.value = '';
            inputBreed.value = '';
            inputSizeLbs.value = '';
            inputGroomerNotes.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
};