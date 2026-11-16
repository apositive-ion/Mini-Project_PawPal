
// PawPal - Beginner JavaScript

let page = document.body.dataset.page;
let pets = JSON.parse(localStorage.getItem("pets")) || [];
let health = JSON.parse(localStorage.getItem("health")) || [];
let care = JSON.parse(localStorage.getItem("care")) || [];
let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
let content = document.getElementById("content");
let today = new Date().toISOString().slice(0, 10);

function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function val(id) {
    return document.getElementById(id).value;
}

function petOptions() {
    let html = "";
    for (let p of pets) html += `<option>${p.name}</option>`;
    return html;
}

function showList(items, key) {
    let html = "";
    for (let x of items) {
        let label = x.name || `${x.pet} - ${x.type || x.activity || x.clinic}`;
        if (key == "health") label += `: ${x.description} (${x.date})`;
        if (key == "care") label = `<input type="checkbox" ${x.done ? "checked" : ""} onchange="updateCare(${x.id},this.checked)"> ${label} (${x.time})`;
        if (key == "appointments") label += ` - ${x.date} ${x.time}`;
        if (key == "reminders") html += `<li>${label}</li>`;
        else html += `<li>${label}<button class="delete-button" onclick="removeItem('${key}',${x.id})">Delete</button></li>`;
    }
    return html || "<li class='empty'>Nothing added yet.</li>";
}

function removeItem(key, id) {
    let items = JSON.parse(localStorage.getItem(key)) || [];
    let updated = [];
    for (let x of items) if (x.id != id) updated.push(x);
    save(key, updated);
    location.reload();
}

function updateCare(id, checked) {
    for (let x of care) if (x.id == id) x.done = checked;
    save("care", care);
}

function petSelect() {
    return `<label>Select pet</label><select id="pet">${petOptions()}</select>`;
}

if (page == "dashboard") {
    content.innerHTML = `<div class="stats"><div class="card">My Pets <h2>${pets.length}</h2></div><div class="card">Health Records <h2>${health.length}</h2></div><div class="card">Appointments <h2>${appointments.length}</h2></div></div>
    <div class="card"><h2>My Pets</h2><ul>${showList(pets,"pets")}</ul></div>`;
}

if (page == "pets") {
    content.innerHTML = `<div class="card"><h2>Add a Pet</h2><form id="form"><label>Name</label><input id="name" required><label>Type</label><select id="type"><option>Dog</option><option>Cat</option></select><label>Age</label><input id="age"><label>Breed</label><input id="breed"><button>Add Pet</button></form></div>
    <div class="card"><h2>My Pets</h2><ul>${showList(pets,"pets")}</ul></div>`;
}

if (page == "health") {
    content.innerHTML = `<div class="card"><h2>Add Health Record</h2><form id="form">${petSelect()}<label>Type</label><select id="type"><option>Vaccination</option><option>Medicine</option><option>Vet Visit</option></select><label>Description</label><input id="description" required><label>Date</label><input id="date" type="date" required><label>Next due date</label><input id="due" type="date"><button>Save</button></form></div>
    <div class="card"><h2>Health Records</h2><ul>${showList(health,"health")}</ul></div>`;
}

if (page == "care") {
    let tasks = [];
    for (let x of care) if (x.date == today) tasks.push(x);
    content.innerHTML = `<div class="card"><h2>Add Daily Task</h2><form id="form">${petSelect()}<label>Activity</label><select id="activity"><option>Feeding</option><option>Walking</option><option>Grooming</option><option>Medicine</option></select><label>Time</label><input id="time" type="time" required><button>Add Task</button></form></div>
    <div class="card"><h2>Today's Care</h2><ul>${showList(tasks,"care")}</ul></div>`;
}

if (page == "appointments") {
    content.innerHTML = `<div class="card"><h2>Book Appointment</h2><form id="form">${petSelect()}<label>Clinic</label><input id="clinic" required><label>Reason</label><input id="reason"><label>Date</label><input id="date" type="date" required><label>Time</label><input id="time" type="time" required><button>Save Appointment</button></form></div>
    <div class="card"><h2>Appointments</h2><ul>${showList(appointments,"appointments")}</ul></div>`;
}

if (page == "reminders") {
    let reminders = [];
    for (let x of health) if (x.due && x.due >= today) reminders.push({name:`${x.pet} - ${x.type}: ${x.due}`});
    for (let x of appointments) if (x.date >= today) reminders.push({name:`${x.pet} - ${x.clinic}: ${x.date}`});
    content.innerHTML = `<div class="card"><h2>Upcoming Reminders</h2><ul>${showList(reminders,"reminders")}</ul></div><div class="card"><h2>Pet Care Tips</h2><p>Give fresh water and healthy food.</p><p>Make time for walks and play.</p><p>Visit your vet regularly.</p></div>`;
}

if (document.getElementById("form")) {
    document.getElementById("form").onsubmit = function(e) {
        e.preventDefault();
        let id = Date.now();
        if (page == "pets") pets.push({id, name:val("name"), type:val("type"), age:val("age"), breed:val("breed")});
        if (page == "health") health.push({id, pet:val("pet"), type:val("type"), description:val("description"), date:val("date"), due:val("due")});
        if (page == "care") care.push({id, pet:val("pet"), activity:val("activity"), time:val("time"), date:today, done:false});
        if (page == "appointments") appointments.push({id, pet:val("pet"), clinic:val("clinic"), reason:val("reason"), date:val("date"), time:val("time")});
        if (page == "pets") save("pets",pets);
        if (page == "health") save("health",health);
        if (page == "care") save("care",care);
        if (page == "appointments") save("appointments",appointments);
        location.reload();
    };
}
