const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

const form = document.getElementById("register-form");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    mensaje.textContent = "";
    mensaje.classList.remove("form-message--ok");

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const itsonId = document.getElementById("itsonId").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;

    if (password !== confirm) {
        mensaje.textContent = "Las contraseñas no coinciden";
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, itsonId, password }),
        });
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "No se pudo crear la cuenta");
        }

        mensaje.classList.add("form-message--ok");
        mensaje.textContent = "Cuenta creada. Redirigiendo al inicio de sesión...";
        setTimeout(function () {
            window.location.href = "login.html";
        }, 1500);
    } catch (error) {
        mensaje.textContent = error.message;
    }
});
