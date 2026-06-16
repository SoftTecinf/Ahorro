

// ==========================================
// VARIABLES GLOBALES
// ==========================================
let familiares = JSON.parse(localStorage.getItem('app_familiares')) || [];
let proyectos = [];
let cuentasBancarias = [];
let invitacionesPendientes = [];
let currentUser = localStorage.getItem('app_currentUser') || '';

// ==========================================
// LÓGICA DE CONTROL DE VISTAS (Global)
// ==========================================

function actualizarLabelUsuario() {
    const label = document.getElementById('user-label');
    const usuario = localStorage.getItem('app_currentUser');
    if (label) {
        label.innerText = usuario ? usuario : "Invitado";
    }
}

// ==========================================
// INICIALIZACIÓN UNIFICADA
// ==========================================
// En js/main.js
// main.js - Modifica tu DOMContentLoaded así:
document.addEventListener('DOMContentLoaded', async () => {
    const usuarioActual = localStorage.getItem('app_currentUser');
    const modal = document.getElementById('modal-identidad');

    if (!usuarioActual) {
        // NO hay usuario: Ocultamos todo y mostramos el Login
        document.querySelectorAll('.vista').forEach(v => v.classList.add('hidden'));
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
        }
    } else {
        // SÍ hay usuario: Iniciamos la App y cargamos la vista por defecto
        document.getElementById('user-label').textContent = usuarioActual;
        await navegarA('inicio'); // Esto carga el contenido y lo muestra
    }
});



// main.js
async function navegarA(nombreVista) {
    console.log("Navegando a:", nombreVista);

    try {
        // 1. Hacemos el fetch al archivo .html (ej. inicio.html, datos.html)
        const respuesta = await fetch(`${nombreVista}.html`);
        const html = await respuesta.text();

        // 2. Inyectamos el HTML en tu contenedor principal (reemplaza 'app' por tu ID real)
        document.getElementById('app').innerHTML = html;

        // 3. Guardamos en el localStorage para que al hacer F5 sepa dónde estaba
        localStorage.setItem('app_ultima_vista', nombreVista);

    } catch (error) {
        console.error("Error al cargar la vista:", error);
    }
}

window.cargarDatosGlobales();