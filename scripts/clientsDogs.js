
document.addEventListener('DOMContentLoaded', function() {
    let del = document.getElementsByClassName('clientDogDelete')
    for (let i = 0; i < del.length; i++) {
        del[i].addEventListener("click", delRow)
    };
    let edit = document.getElementsByClassName('clientDogEdit')
    for (let i = 0; i < del.length; i++) {
        edit[i].addEventListener("click", populateEditForm)
    };
});

function delRow(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this client-dog pair?")) {
        let td = event.target.parentNode; 
        let tr = td.parentNode; 
        tr.parentNode.removeChild(tr);
    };
};

function showEditForm() {
    document.getElementById('editClientDogForm').style.display='none';
    document.getElementById('editClientDogForm').style.display='block';
}

function populateEditForm(event) {
    event.preventDefault();
    let tr = event.target.parentNode.parentNode; 
    let children = tr.children;
    document.getElementById('editClient').value = children[0].textContent;
    document.getElementById('editDog').value = children[1].textContent;
    showEditForm('editClientDogForm');
}
