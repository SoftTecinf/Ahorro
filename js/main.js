

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
       const ultimaVista = localStorage.getItem('app_ultima_vista') || 'inicio';
    navegarA(ultimaVista);
    }
});



// main.js
async function navegarA(nombreVista) {
    console.log("Cargando archivo:", `${nombreVista}.html`);

    try {
        // 1. Fetch del archivo externo
        const respuesta = await fetch(`${nombreVista}.html`);
        if (!respuesta.ok) throw new Error("No se pudo cargar el archivo");
        const contenido = await respuesta.text();

        // 2. Inyectar contenido en el div correspondiente (ej: id="inicio")
        const contenedorDestino = document.getElementById(nombreVista);
        if (contenedorDestino) {
            contenedorDestino.innerHTML = contenido;
        setTimeout(() => {
            contenedor.style.display = 'block'; 
            contenedor.classList.remove('hidden');
        }, 10);}

        // 3. Ocultar todas las vistas y mostrar solo la seleccionada
        document.querySelectorAll('.vista').forEach(v => v.classList.add('hidden'));
        if (contenedorDestino) contenedorDestino.classList.remove('hidden');

        // 4. Gestionar botones
        document.querySelectorAll('button[data-vista]').forEach(btn => {
            if (btn.getAttribute('data-vista') === nombreVista) {
                btn.classList.add('nav-btn-active');
                btn.classList.remove('nav-btn-inactive');
            } else {
                btn.classList.remove('nav-btn-active');
                btn.classList.add('nav-btn-inactive');
            }
        });
    } catch (error) {
        console.error("Error al cargar la vista:", error);
    }
}

window.cargarDatosGlobales();
window.onload = () => navegarA('inicio');