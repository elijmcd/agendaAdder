// let agendaAdder = document.getElementById("agendaAdder")
// let agendaAdding = document.getElementById("agendaAdding")
// let agendaAdded = document.getElementById("agendaAdded")
// agendaAdder.addEventListener("submit", (a) => {
//     a.preventDefault()
//     addAgenda(agendaAdding.value)
// })
// function addAgenda(x) {
//     let addHTML = `<li>${x} <button class="abolishbutton" onclick="abolishAgenda(this)">Abolish Agendum</button></li>`
//     agendaAdded.insertAdjacentHTML("beforeend", addHTML)
//     agendaAdding.value = ""
//     agendaAdding.focus()
// }
// function abolishAgenda(abolish) {
//     abolish.parentElement.remove()
// }

$(function () {
    prepareLocalStorage();
    showAgenda(getLocalStorage());

    // for tooltips on hover
    // document.querySelectorAll('[data-toggle="tooltip"]').tooltip({
    //     trigger: 'hover'
    // })

    // count agenda
    $("#agendaCount").text(`CURRENT AGENDA (${getAgendaCount()})`);
});

let agendaArray = [];

function prepareLocalStorage() {
    if (getLocalStorage() == null) {
        setLocalStorage(new Array());
    }
}

function getLocalStorage() {
    let agendaList = JSON.parse(localStorage.getItem("agendaArray")) || [];
    if (agendaList.length == 0) {
        agendaList = agendaArray;
        localStorage.setItem("agendaArray", JSON.stringify(agendaList));
    }
    return JSON.parse(localStorage.getItem("agendaArray"));
    // return agendaList;

}

function setLocalStorage(data) {
    // let agendaArray = [];
    localStorage.setItem("agendaArray", JSON.stringify(data));
}

function createAgendum(formData) {
    let agenda = getLocalStorage();

    let agendum = {
        id: generateAgendumId(),
        created: new Date(),
        completed: false,
        title: formData[1].value,
        dueDate: new Date(`${formData[2].value} 00:00`)
    }

    agenda.push(agendum);
    setLocalStorage(agenda);
    showAgenda();
}

function editAgendum(formData) {
    let agenda = getLocalStorage();
    let agendumId = formData[1].value;
    let agendum = agenda.find(t => t.id == agendumId);
    agendum.title = formData[2].value;
    agendum.dueDate = new Date(formData[3].value);
    setLocalStorage(agenda);
    showAgenda();
}

// function saveAgendum(task) {}

function showAgenda() {
    const template = document.getElementById("template");
    const agendaBody = document.getElementById("agendaBody");

    let agenda = getLocalStorage();
    agendaBody.innerHTML = "";
    for (var row = 0; row < agenda.length; row++) {
        const agendaRow = document.importNode(template.content, true);

        if (agenda[row].completed) {
            agendaRow.getElementById("agendaRow").setAttribute("class", "complete");
        }

        agendaRow.getElementById("id").textContent = agenda[row].id;
        agendaRow.getElementById("title").textContent = agenda[row].title;
        agendaRow.getElementById("created").textContent = displayDate(agenda[row].created);
        agendaRow.getElementById("dueDate").textContent = displayDate(agenda[row].dueDate);
        agendaRow.getElementById("tdCrud").setAttribute("data-id", agenda[row].id);

        agendaBody.appendChild(agendaRow);
    }
}

function abolishAgendum(element) {
    // clearToolTip();
    let agendumId = getAgendumId(element);
    let agenda = getLocalStorage();
    let index = agenda.findIndex(t => t.id == agendumId);

    agenda.splice(index, 1);
    setLocalStorage(agenda);
    showAgenda();
}

function accomplishAgendum(element) {
    // clearToolTip();

    let agenda = getLocalStorage();
    let agendumId = getAgendumId(element);
    let agendum = agenda.find(t => t.id == agendumId);
    agendum.completed = true;
    setLocalStorage(agenda);
    showAgenda();
}

function generateAgendumId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getAgendumId(element) {
    let agendumId = $(element).parent().attr("data-id");
    return agendumId;
}

function getIndex(element) {
    let agendumIndex = $(element).parent().attr("data-id");
    return agendumIndex
}

function getAgendaCount() {
    return getLocalStorage().length;
}

// function

function clearTooltip() {}

function triggerAlert(title, message) {}

function popEditModal(element) {
    let agenda = getLocalStorage();
    let agendumId = getAgendumId(element);
    let agendum = agenda.find(t => t.id == agendumId);

    document.getElementById("editId").value = agendum.id;
    document.getElementById("editTitle").value = agendum.title;
    document.getElementById("editDueDate").value = displayDate(agendum.dueDate);

    
}

function displayDate(date) {
    return date.toString().split("T")[0];
}