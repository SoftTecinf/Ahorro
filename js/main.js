

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
function navegarA(nombreVista) {
    console.log("Navegando a:", nombreVista);

    // 1. Ocultar TODAS las vistas
    document.querySelectorAll('.vista').forEach(v => {
        v.classList.add('hidden');
        v.style.display = 'none';
    });

    // 2. Mostrar la seleccionada (buscando por ID)
    // Nota: Asegúrate de que el ID en tu HTML sea EXACTAMENTE 'config'
    const vista = document.getElementById(nombreVista);
    
    if (vista) {
        vista.classList.remove('hidden');
        vista.style.display = 'block';
    } else {
        console.error("No existe el div con id:", nombreVista);
    }

    // 3. Gestión de botones activa/inactiva
    document.querySelectorAll('button[data-vista]').forEach(btn => {
        btn.classList.toggle('nav-btn-active', btn.getAttribute('data-vista') === nombreVista);
        btn.classList.toggle('nav-btn-inactive', btn.getAttribute('data-vista') !== nombreVista);
    });
}

// ESTA LÍNEA VA FUERA DE LA FUNCIÓN
window.onload = () => navegarA('inicio');

window.cargarDatosGlobales();