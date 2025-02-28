
document.addEventListener('DOMContentLoaded', function() {
    let del = document.getElementsByClassName('employeeDelete')
    for (let i = 0; i < del.length; i++) {
        del[i].addEventListener("click", delRow)
    };
    let edit = document.getElementsByClassName('employeeEdit')
    for (let i = 0; i < del.length; i++) {
        edit[i].addEventListener("click", populateEditForm)
    };
});

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