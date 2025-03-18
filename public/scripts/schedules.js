
document.addEventListener('DOMContentLoaded', function() {
    // Store original table states
    let table = document.getElementById('scheduleTable');
    table.oldHtml = table.innerHTML;
    table = document.getElementById('availabilityTable');
    table.oldHtml = table.innerHTML;
    table = document.getElementById('employeeID');
    table.oldHtml = table.innerHTML;
    table = document.getElementById('editScheduleEmployee');
    table.oldHtml = table.innerHTML;
    // Populate table
    refreshTable();
    refreshAvailabilityTable();
    // Get insert form
    let addScheduleForm = document.getElementById('scheduleForm');
    // apply insert form event listener
    addScheduleForm.addEventListener("submit", addNewSchedule);
    // Get Update form
    let updateScheduleForm = document.getElementById('updateScheduleForm');
    // apply update form event listener
    updateScheduleForm.addEventListener("submit", updateRow);
});

function refreshTable() {
    let table = document.getElementById('scheduleTable');
    // Removing old rows
    table.innerHTML = table.oldHtml;
    // Refresh Dropdowns
    refreshDropdowns();
    var xhttp = new XMLHttpRequest();
    //alert("test")
    xhttp.open("GET", "/schedulesSel", true);
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
            let del = document.getElementsByClassName('scheduleDelete')
            for (let i = 0; i < del.length; i++) {
                del[i].addEventListener("click", delRow)
            };
            let edit = document.getElementsByClassName('scheduleEdit')
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
    let date = data['start'].slice(0, 10);
    
    //let date = new Date(data['start'].slice(0, 10));
    //let offset = 8;
    // Check for daylight savings
    //if (((date.getDate() - date.getDay() > 7 && date.getMonth() >= 3) || date.getMonth() > 3) && ((date.getDate() - date.getDay() < 1 && date.getMonth() <= 11) || date.getMonth() < 11)) {
    //   offset = 7;
    //}
    date = data['start'].slice(0, 10);
    newRow.innerHTML = `\
    <tr>\
        <td>${data['scheduleID']}</td>\
        <td name="${data['employeeID']}">${data['name']}</td>\
        <td>${date}</td>\
        <td>${formatTime(data['start'].slice(11), true)}</td>\
        <td>${formatTime(data['end'].slice(11), true)}</td>\
        <td><button class="scheduleEdit">Edit</button></td>\
        <td type="button" class="scheduleDelete"><button>Delete</button></td>\
    </tr>`;
    table.appendChild(newRow);
};

function formatTime(time, minus8 = false) {
    if (time !== null){
        let hour = parseInt(time.slice(0, 2));
        if (minus8) {
            hour = (hour <= 8) ? hour + 16 : hour - 8;   // For some reason the query is adding 8 hours??
        };
        let amPm = (hour > 11 && hour < 24) ? ' pm' : ' am';
        hour = (hour > 12) ? hour - 12 : hour;      // Convert to 12 hour time
        hour = hour.toString();
        return hour.padStart(2, '0') + time.slice(2, 5) + amPm;
    } else {
        return '';
    };
};

function refreshAvailabilityTable() {
    let table = document.getElementById('availabilityTable');
    // Removing old rows
    table.innerHTML = table.oldHtml;
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;
    if (startDate !== '') {
        document.getElementById('endDate').min = startDate;
        startDate = '/' + startDate
    } else {
        document.getElementById('endDate').min = "2024-02-01";
    }
    if (endDate !== '') {
        document.getElementById('startDate').max = endDate;
        endDate = '/' + endDate
    } else {
        document.getElementById('startDate').max = '';
    }
    //alert(data['startDate'] === '');
    var xhttp = new XMLHttpRequest();
    //alert("test")
    xhttp.open("GET", `/schedulesAvailability${startDate}${endDate}`, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(JSON.parse(xhttp.responseText));
            let data = JSON.parse(xhttp.responseText)
            // Add the new rows to the table
            for (let i = 0; i < data.length; i++ ) {
                createAvailability(data[i], table);
            };
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send();
};

function createAvailability(data, table) {
    let newRow = document.createElement('tr');
    let date = data['date'].slice(0, 10);

    newRow.innerHTML = `\
    <tr>\
        <td>${data['name']}</td>\
        <td>${date}</td>\
        <td>${formatTime(data['start'])}</td>\
        <td>${formatTime(data['session_start'])}</td>\
        <td>${formatTime(data['session_end'])}</td>\
        <td>${formatTime(data['session_start1'])}</td>\
        <td>${formatTime(data['session_end1'])}</td>\
        <td>${formatTime(data['session_start2'])}</td>\
        <td>${formatTime(data['session_end2'])}</td>\
        <td>${formatTime(data['session_start3'])}</td>\
        <td>${formatTime(data['session_end3'])}</td>\
        <td>${formatTime(data['session_start4'])}</td>\
        <td>${formatTime(data['session_end4'])}</td>\
        <td>${formatTime(data['session_start5'])}</td>\
        <td>${formatTime(data['session_end5'])}</td>\
        <td>${formatTime(data['session_start6'])}</td>\
        <td>${formatTime(data['session_end6'])}</td>\
        <td>${formatTime(data['TIME(Schedules.end)'])}</td>\
    </tr>`;
    table.appendChild(newRow);
};

function refreshDropdowns() {
    // Clear dropdowns
    dd = document.getElementById('employeeID');
    dd2 = document.getElementById('editScheduleEmployee');
    dd.innerHTML = dd.oldHtml;
    dd2.innerHTML = dd2.oldHtml;

    // Query new data
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/employeesDropdown", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //alert(xhttp.responseText);
            let data = JSON.parse(xhttp.responseText)
            // Add the new rows to the table
            for (let i = 0; i < data.length; i++ ) {
                let newRow = document.createElement('option');
                newRow.value = data[i]['employeeID'];
                newRow.textContent = data[i]['name'];
                dd.appendChild(newRow);
                dd2.appendChild(newRow.cloneNode(true));
            };
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send();
};

function addNewSchedule(event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Get form fields we need to get data from
    let inputID = document.getElementById("employeeID");
    let inputStartTime = document.getElementById("startTime");
    let inputEndTime = document.getElementById("endTime");
    
    // Put our data we want to send in a javascript object
    let data = {
        employeeID: inputID.value,
        startTime: inputStartTime.value,
        endTime: inputEndTime.value,
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-schedule", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            refreshTable();
            refreshAvailabilityTable();

            // Clear the input fields for another transaction
            inputID.selectedIndex = '';
            inputStartTime.value = '';
            inputEndTime.value = '';
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
    if (confirm("Are you sure you want to delete this schedule?")) {
        let td = event.target.parentNode; 
        let tr = td.parentNode; 
        let data = {
            id: tr.children[0].textContent
        };
        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", '/delete-schedule/', true);
        xhttp.setRequestHeader("Content-type", "application/json");
    
        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 204) {
                // Remove row from table
                tr.parentNode.removeChild(tr)
                refreshAvailabilityTable();
                document.getElementById('editScheduleForm').style.visibility = 'hidden';
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
    let updateID = document.getElementById('editScheduleID');
    let updateEmployee = document.getElementById("editScheduleEmployee");
    let updateDate = document.getElementById("editScheduleDate");
    let updateStart = document.getElementById("editScheduleStart");
    let updateEnd = document.getElementById("editScheduleEnd");
    // Put our data we want to send in a javascript object
    let data = {
        id: updateID.textContent,
        name: updateEmployee.value,
        start: updateDate.value + ' ' + updateStart.value + ':00',
        end: updateDate.value + ' ' + updateEnd.value + ':00'
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-schedule", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            refreshTable();
            // Hiding edit window
            document.getElementById('editScheduleForm').style.visibility = 'hidden';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
};

function showEditForm() {
    document.getElementById('editScheduleForm').style.display='none';
    document.getElementById('editScheduleForm').style.display='block';
    document.getElementById('editScheduleForm').style.visibility = 'visible';
}

function populateEditForm(event) {
    event.preventDefault();
    let tr = event.target.parentNode.parentNode; 
    let children = tr.children;
    document.getElementById('editScheduleID').textContent = children[0].textContent;
    console.log(document.getElementById('editScheduleEmployee'))
    document.getElementById('editScheduleEmployee').value = children[1].getAttribute('name');
    document.getElementById('editScheduleDate').value = children[2].textContent.replace(' ', "T");
    let time = 0; 
    // Format for datetime input
    if (children[3].textContent.slice(-3) === ' pm'){
        time = children[3].textContent.slice(0, -6);
        time = parseInt(time);
        time += (time < 12)? 12 : 0;
        time = time.toString();
        time += children[3].textContent.slice(-6, -3);
    } else {
        time = children[3].textContent.slice(0, -3);
    }
    document.getElementById('editScheduleStart').value = time;
    if (children[4].textContent.slice(-3) === ' pm'){
        time = children[4].textContent.slice(0, -6);
        time = parseInt(time);
        time += (time < 12)? 12 : 0;
        time = time.toString();
        time += children[4].textContent.slice(-6, -3);
    } else {
        time = children[4].textContent.slice(0 -3);
    }
    document.getElementById('editScheduleEnd').value = time;
    showEditForm('editScheduleForm');
    document.getElementById('editScheduleForm').scrollIntoView();
}
