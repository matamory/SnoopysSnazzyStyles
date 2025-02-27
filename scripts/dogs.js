
document.addEventListener('DOMContentLoaded', function() {
    let del = document.getElementsByClassName('dogDelete')
    for (let i = 0; i < del.length; i++) {
        del[i].addEventListener("click", delRow)
    };
    let edit = document.getElementsByClassName('dogsEdit')
    for (let i = 0; i < del.length; i++) {
        edit[i].addEventListener("click", populateEditForm)
    };
});

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
