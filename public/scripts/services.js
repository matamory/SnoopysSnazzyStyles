
const SERVICE_SELECT = 'SELECT * FROM Services;'

document.addEventListener('DOMContentLoaded', function() {
    let del = document.getElementsByClassName('serviceDelete')
    for (let i = 0; i < del.length; i++) {
        del[i].addEventListener("click", delRow)
    };
    let edit = document.getElementsByClassName('serviceEdit')
    for (let i = 0; i < del.length; i++) {
        edit[i].addEventListener("click", populateEditForm)
    };
    //populateSelectTable();
});


function populateSelectTable(){
    alert(test);
     db.pool.query(SERVICE_SELECT, function (err, results, fields){
        alert(JSON.stringify(results));
        for(let i = 0; i < results.length; i++){
            table = document.getElementById('servicesTable');
            
        }
     })
}

function delRow(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this service?")) {
        let td = event.target.parentNode; 
        let tr = td.parentNode; 
        tr.parentNode.removeChild(tr);
    };
};

function showEditForm() {
    document.getElementById('editServiceForm').style.display='none';
    document.getElementById('editServiceForm').style.display='block';
}

function populateEditForm(event) {
    event.preventDefault();
    let tr = event.target.parentNode.parentNode; 
    let children = tr.children;
    document.getElementById('editServiceID').textContent = children[0].textContent;
    document.getElementById('editServiceName').value = children[1].textContent;
    document.getElementById('editServiceDuration').value = children[2].textContent.slice(0, -4);
    document.getElementById('editServicePrice').value = children[3].textContent.slice(1);
    showEditForm('editServiceForm');
}
