
document.addEventListener('DOMContentLoaded', function() {
    let del = document.getElementsByClassName('sessionDelete')
    for (let i = 0; i < del.length; i++) {
        del[i].addEventListener("click", delRow)
    };
    let edit = document.getElementsByClassName('sessionEdit')
    for (let i = 0; i < del.length; i++) {
        edit[i].addEventListener("click", populateEditForm)
    };
});

function delRow(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this session?")) {
        let td = event.target.parentNode; 
        let tr = td.parentNode; 
        tr.parentNode.removeChild(tr);
    };
};

let serviceFields = 1
function addService() {
    serviceFields++;
    let services = document.getElementById("serviceEntry");
    let newSelect = document.createElement("div");
    newSelect.innerHTML = '<select name="service_id" id="service_idSelect" required >\
                    <option value="0">Nail Trim</option>\
                    <option value="1">Puppy Cut</option>\
                    <option value="2">Basic Cut: Fluffy Breeds</option>\
                    <option value="3">Basic Cut: Short Coats</option>\
                    </select>';
    newSelect.id = "service_id " + serviceFields
    newSelect.className = "service_id"
    services.appendChild(newSelect); 
}

function removeService() {
    if (serviceFields > 1){
        let services = document.getElementById("serviceEntry");
        let oldSelect = document.getElementById("service_id " + serviceFields);
        
        services.removeChild(oldSelect);
        
        serviceFields--;
    }
}

function showEditForm() {
    document.getElementById('editSessionForm').style.display='none';
    document.getElementById('editSessionForm').style.display='block';
}

function populateEditForm(event) {
    event.preventDefault();
    let tr = event.target.parentNode.parentNode; 
    let children = tr.children;
    document.getElementById('editSessionID').textContent = children[0].textContent;
    document.getElementById('editSessionEmployee').value = children[1].textContent;
    document.getElementById('editSessionClient').value = children[2].textContent;
    document.getElementById('editSessionDog').value = children[3].textContent;
    document.getElementById('editSessionTime').value = children[4].textContent.replace(' ', "T");
    document.getElementById('editSessionDuration').value = children[5].textContent.slice(0, -4);
    document.getElementById('editSessionPrice').value = children[6].textContent.slice(1);
    document.getElementById('editSessionStatus').value = children[7].textContent;
    showEditForm('editSessionForm');
}

