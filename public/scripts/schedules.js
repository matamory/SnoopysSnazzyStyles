
document.addEventListener('DOMContentLoaded', function() {
    let del = document.getElementsByClassName('scheduleDelete')
    for (let i = 0; i < del.length; i++) {
        del[i].addEventListener("click", delRow)
    };
    let edit = document.getElementsByClassName('scheduleEdit')
    for (let i = 0; i < del.length; i++) {
        edit[i].addEventListener("click", populateEditForm)
    };
});

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
