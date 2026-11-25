const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

const form = document.getElementById("login-form");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    mensaje.textContent = "";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Correo o contraseña incorrectos");
        }

        localStorage.setItem("authToken", data.token);

        window.location.href = "home.html";
    } catch (error) {
        mensaje.textContent = error.message;
    }
});
