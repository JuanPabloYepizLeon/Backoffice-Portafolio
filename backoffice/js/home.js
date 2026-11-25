const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

const token = localStorage.getItem("authToken");

if (!token) {
    cerrarSesion();
}

const form = document.getElementById("project-form");
const formTitulo = document.getElementById("form-titulo");
const lista = document.querySelector(".projects__list");
const totalProyectos = document.getElementById("total-proyectos");
const modalEliminar = document.getElementById("modal-eliminar");

let proyectoEditando = null;
let proyectoEliminar = null;

function cerrarSesion() {
    localStorage.removeItem("authToken");
    window.location.replace("login.html");
}

async function getProjectsByUser() {
    const res = await fetch(`${API_BASE}/projects`, {
        headers: { "auth-token": token },
    });
    if (!res.ok) throw new Error("Error al obtener proyectos");
    return res.json();
}

async function getProjectById(id) {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
        headers: { "auth-token": token },
    });
    if (!res.ok) throw new Error("Proyecto no encontrado");
    return res.json();
}

async function createProject(project) {
    const res = await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token,
        },
        body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error("Error al crear proyecto");
    return res.json();
}

async function updateProject(projectId, updates) {
    const res = await fetch(`${API_BASE}/projects/${projectId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token,
        },
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Error al actualizar");
    return res.json();
}

async function deleteProject(projectId) {
    const res = await fetch(`${API_BASE}/projects/${projectId}`, {
        method: "DELETE",
        headers: { "auth-token": token },
    });
    if (!res.ok) throw new Error("Error al eliminar");
    return res.json();
}

function crearTarjeta(proyecto) {
    const li = document.createElement("li");
    li.className = "project";

    const titulo = document.createElement("h3");
    titulo.textContent = proyecto.title;

    const descripcion = document.createElement("p");
    descripcion.textContent = proyecto.description;

    const tech = document.createElement("p");
    tech.className = "project__tech";
    tech.textContent = (proyecto.technologies || []).join(", ");

    const enlace = document.createElement("a");
    enlace.href = proyecto.repository || "#";
    enlace.target = "_blank";
    enlace.textContent = "Ver repositorio";

    const imagenes = proyecto.images || [];
    const enlacesImagenes = imagenes.map((url, i) => {
        const enlaceImagen = document.createElement("a");
        enlaceImagen.href = url;
        enlaceImagen.target = "_blank";
        enlaceImagen.textContent = imagenes.length === 1 ? "Ver imágenes" : `Ver imagen ${i + 1}`;
        return enlaceImagen;
    });

    const botones = document.createElement("div");
    botones.className = "project__buttons";

    const btnActualizar = document.createElement("button");
    btnActualizar.type = "button";
    btnActualizar.className = "btn btn--small";
    btnActualizar.textContent = "Actualizar";
    btnActualizar.addEventListener("click", () => {
        editarProyecto(proyecto._id);
    });

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn btn--small btn--danger";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => {
        abrirModalEliminar(proyecto);
    });

    botones.append(btnActualizar, btnEliminar);
    li.append(titulo, descripcion, tech, enlace, ...enlacesImagenes, botones);
    return li;
}

async function cargarProyectos() {
    try {
        const proyectos = await getProjectsByUser();
        lista.innerHTML = "";
        totalProyectos.textContent = proyectos.length;
        proyectos.forEach((proyecto) => {
            lista.appendChild(crearTarjeta(proyecto));
        });
    } catch (error) {
        alert(error.message);
    }
}

function cerrarFormulario() {
    form.hidden = true;
    form.reset();
    proyectoEditando = null;
}

async function editarProyecto(id) {
    try {
        const proyecto = await getProjectById(id);
        proyectoEditando = id;
        document.getElementById("title").value = proyecto.title;
        document.getElementById("description").value = proyecto.description;
        document.getElementById("technologies").value = (proyecto.technologies || []).join(", ");
        document.getElementById("repository").value = proyecto.repository || "";
        document.getElementById("images").value = (proyecto.images || []).join(", ");
        formTitulo.textContent = "Actualizar proyecto";
        form.hidden = false;
    } catch (error) {
        alert(error.message);
    }
}

function abrirModalEliminar(proyecto) {
    proyectoEliminar = proyecto._id;
    document.getElementById("modal-proyecto").textContent = proyecto.title;
    modalEliminar.showModal();
}

async function eliminarProyecto() {
    try {
        await deleteProject(proyectoEliminar);
        modalEliminar.close();
        cargarProyectos();
    } catch (error) {
        alert(error.message);
    }
}

document.getElementById("btn-confirmar-eliminar").addEventListener("click", eliminarProyecto);

document.getElementById("btn-cancelar-eliminar").addEventListener("click", () => {
    modalEliminar.close();
});

modalEliminar.addEventListener("close", () => {
    proyectoEliminar = null;
});

document.getElementById("btn-nuevo").addEventListener("click", () => {
    cerrarFormulario();
    formTitulo.textContent = "Nuevo proyecto";
    form.hidden = false;
});

document.getElementById("btn-cancelar").addEventListener("click", cerrarFormulario);

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const datos = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        technologies: document.getElementById("technologies").value
            .split(",")
            .map((t) => { return t.trim(); })
            .filter((t) => { return t !== ""; }),
        images: document.getElementById("images").value
            .split(",")
            .map((url) => { return url.trim(); })
            .filter((url) => { return url !== ""; }),
    };

    const repository = document.getElementById("repository").value;
    if (repository) {
        datos.repository = repository;
    }

    try {
        if (proyectoEditando) {
            await updateProject(proyectoEditando, datos);
        } else {
            await createProject(datos);
        }
        cerrarFormulario();
        cargarProyectos();
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById("logout").addEventListener("click", (event) => {
    event.preventDefault();
    cerrarSesion();
});

cargarProyectos();
