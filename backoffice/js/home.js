const token = localStorage.getItem("authToken");

if (!token) {
    cerrarSesion();
}

const form = document.getElementById("project-form");

function cerrarSesion() {
    localStorage.removeItem("authToken");
    window.location.replace("login.html");
}

document.getElementById("btn-nuevo").addEventListener("click", function () {
    form.hidden = false;
});

document.getElementById("btn-cancelar").addEventListener("click", function () {
    form.hidden = true;
    form.reset();
});

form.addEventListener("submit", function (event) {
    event.preventDefault();
});

document.getElementById("logout").addEventListener("click", function (event) {
    event.preventDefault();
    cerrarSesion();
});
