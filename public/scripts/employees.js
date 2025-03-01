
document.addEventListener('DOMContentLoaded', function() {
    let table = document.getElementById('employeeTable');
    table.oldHtml = table.innerHTML;
    refreshTable();
});

function refreshTable() {
    let table = document.getElementById('employeeTable');
    // Removing old rows
    table.innerHTML = table.oldHtml;
    var xhttp = new XMLHttpRequest();
    //alert("test")
    xhttp.open("GET", "/employeesSel", true);
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
            let del = document.getElementsByClassName('employeeDelete')
            for (let i = 0; i < del.length; i++) {
                del[i].addEventListener("click", delRow)
            };
            let edit = document.getElementsByClassName('employeeEdit')
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
        <td>${data['employeeID']}</td>\
        <td>${data['name']}</td>\
        <td>${data['hourly_wage']}</td>\
        <td>${data['years_experience']}</td>\
        <td>${data['phone_number']}</td>\
        <td>${data['email']}</td>\
        <td>${data['address']}</td>\
        <td>${data['is_active']}</td>\
        <td><button class="employeeEdit">Edit</button></td>\
        <td><button type="button" class="employeeDelete">Delete</button></td>\
    </tr>`;
    table.appendChild(newRow);
};


function delRow(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this employee?")) {
        let td = event.target.parentNode; 
        let tr = td.parentNode; 
        tr.parentNode.removeChild(tr);
    };
};

function showEditForm() {
    document.getElementById('editEmployeesForm').style.display='none';
    document.getElementById('editEmployeesForm').style.display='block';
}

function populateEditForm(event) {
    event.preventDefault();
    let tr = event.target.parentNode.parentNode; 
    let children = tr.children;
    document.getElementById('editEmployeeID').textContent = children[0].textContent;
    document.getElementById('editEmployeesName').value = children[1].textContent;
    document.getElementById('editEmployeesWage').value = children[2].textContent.slice(-5);
    document.getElementById('editEmployeesExperience').value = children[3].textContent;
    document.getElementById('editEmployeesPhone').value = children[4].textContent;
    document.getElementById('editEmployeesEmail').value = children[5].textContent;
    document.getElementById('editEmployeesAddress').value = children[6].textContent;
    document.getElementById('editEmployeesActive').value = children[7].textContent;
    showEditForm('editEmployeesForm');
}