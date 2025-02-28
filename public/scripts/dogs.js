//var fetch = require("node-fetch");

document.addEventListener('DOMContentLoaded', function() {
    refreshTable();
});

function refreshTable() {
    let table = document.getElementById('dogTable');
    // Removing old rows
    let tableRows = table.children;
    for (let i = 0; i < tableRows.length; i++) {
        table.removeChild(tableRows[i]);
    };
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
                let newRow = document.createElement('tr');
                newRow.innerHTML = `\
                <tr>\
                    <td>${data[i]['dogID']}</td>\
                    <td>${data[i]['name']}</td>\
                    <td>${data[i]['age']}</td>\
                    <td>${data[i]['breed']}</td>\
                    <td>${data[i]['size_lbs']}</td>\
                    <td>${data[i]['groomer_notes']}</td>\
                    <td><button class="dogsEdit">Edit</button></td>\
                    <td><button type="button" class="dogDelete">Delete</button></td>\
                </tr>`
                table.appendChild(newRow);
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

function delRow(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this dog?")) {
        let td = event.target.parentNode; 
        let tr = td.parentNode; 
        tr.parentNode.removeChild(tr);
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
