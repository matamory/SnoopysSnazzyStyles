
document.addEventListener('DOMContentLoaded', function() {
    let del = document.getElementsByClassName('clientDelete')
    for (let i = 0; i < del.length; i++) {
        del[i].addEventListener("click", delRow)
    };
    let edit = document.getElementsByClassName('clientEdit')
    for (let i = 0; i < del.length; i++) {
        edit[i].addEventListener("click", populateEditForm)
    };
});

function delRow(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this client?")) {
        let td = event.target.parentNode; 
        let tr = td.parentNode; 
        tr.parentNode.removeChild(tr);
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
