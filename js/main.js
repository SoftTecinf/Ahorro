

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
    console.log("--- Inicio de Navegación ---");
    console.log("Vista solicitada:", nombreVista);

    // 1. Ocultar todas las vistas
    const vistas = document.querySelectorAll('.vista');
    vistas.forEach(v => {
        v.classList.add('hidden');
    });

    // 2. Mostrar la vista seleccionada
    // Usamos el ID exacto que tienes en tu HTML (ej: 'inicio', 'datos', 'config')
    const vistaACargar = document.getElementById(nombreVista);
    
    if (vistaACargar) {
        vistaACargar.classList.remove('hidden');
        console.log("Vista encontrada y mostrada:", nombreVista);
    } else {
        console.error("ERROR CRÍTICO: No se encontró el div con id:", nombreVista);
    }

    // 3. Gestionar botones
    const botones = document.querySelectorAll('button[data-vista]');
    botones.forEach(btn => {
        if (btn.getAttribute('data-vista') === nombreVista) {
            btn.classList.add('nav-btn-active');
            btn.classList.remove('nav-btn-inactive');
            console.log("Botón activado:", btn.id);
        } else {
            btn.classList.remove('nav-btn-active');
            btn.classList.add('nav-btn-inactive');
        }
    });
}

window.cargarDatosGlobales();