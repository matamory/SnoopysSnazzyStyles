
document.addEventListener('DOMContentLoaded', function() {
    let table = document.getElementById('employeeTable');
    table.oldHtml = table.innerHTML;
    refreshTable();
    // Get insert form
    let addEmployeeForm = document.getElementById('employeeForm');
    // apply insert form event listener
    addEmployeeForm.addEventListener("submit", addNewEmployee);
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

function addNewEmployee(event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("employeeName");
    let inputWage = document.getElementById("employeewage");
    let inputExperience = document.getElementById("employeeExperience");
    let inputPhone = document.getElementById("employeePhone");
    let inputEmail = document.getElementById("employeeEmail");
    let inputAddress = document.getElementById("employeeAddress");
    let inputActive = document.getElementById("employeeisActive");
    alert(inputActive.value)
    // Put our data we want to send in a javascript object
    let data = {
        name: inputName.value,
        wage: inputWage.value,
        experience: inputExperience.value,
        phone: inputPhone.value,
        email: inputEmail.value,
        address: inputAddress.value,
        active: inputActive.value
    }
    alert(inputActive.value);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-employee", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            refreshTable();

            // Clear the input fields for another transaction
            inputName.value = '';
            inputWage.value = '';
            inputExperience.value = '';
            inputPhone.value = '';
            inputEmail.value = '';
            inputAddress.value = '';
            inputActive.value = '';
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