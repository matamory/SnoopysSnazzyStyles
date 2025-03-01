
document.addEventListener('DOMContentLoaded', function() {
    // Store original table state
    let table = document.getElementById('scheduleTable');
    table.oldHtml = table.innerHTML;
    table = document.getElementById('availabilityTable');
    table.oldHtml = table.innerHTML;
    // Populate table
    refreshTable();
    refreshAvailabilityTable();
});

function refreshTable() {
    let table = document.getElementById('scheduleTable');
    // Removing old rows
    table.innerHTML = table.oldHtml;
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

    newRow.innerHTML = `\
    <tr>\
        <td>${data['name']}</td>\
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
    }
    if (endDate !== '') {
        endDate = '/' + endDate
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
    </tr>`;
    table.appendChild(newRow);
};


function delRow(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this schedule?")) {
        let td = event.target.parentNode; 
        let tr = td.parentNode; 
        tr.parentNode.removeChild(tr);
    };
};

function showEditForm() {
    document.getElementById('editScheduleForm').style.display='none';
    document.getElementById('editScheduleForm').style.display='block';
}

function populateEditForm(event) {
    event.preventDefault();
    let tr = event.target.parentNode.parentNode; 
    let children = tr.children;
    document.getElementById('editScheduleEmployee').value = children[0].textContent;
    document.getElementById('editScheduleDate').value = children[1].textContent.replace(' ', "T");
    let time = 0; 
    // Format for datetime input
    if (children[2].textContent.slice(-3) === ' pm'){
        time = children[2].textContent.slice(0, -6);
        time = parseInt(time);
        time += (time < 12)? 12 : 0;
        time = time.toString();
        time += children[2].textContent.slice(-6, -3);
    } else {
        time = children[2].textContent.slice(0, -3);
    }
    document.getElementById('editScheduleStart').value = time;
    if (children[3].textContent.slice(-3) === ' pm'){
        time = children[3].textContent.slice(0, -6);
        time = parseInt(time);
        time += (time < 12)? 12 : 0;
        time = time.toString();
        time += children[3].textContent.slice(-6, -3);
    } else {
        time = children[3].textContent.slice(0 -3);
    }
    document.getElementById('editScheduleEnd').value = time;
    showEditForm('editScheduleForm');
}
