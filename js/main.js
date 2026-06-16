

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
function navegarA(nombreVista) {
    // 1. Ocultar todas las vistas (añadir 'hidden' a todas)
    document.querySelectorAll('.vista').forEach(v => v.classList.add('hidden'));

    // 2. Mostrar solo la vista seleccionada
    // IMPORTANTE: nombreVista debe ser 'inicio', 'datos' o 'configurar'
    const vistaACargar = document.getElementById(`vista-${nombreVista}`);
    if (vistaACargar) {
        vistaACargar.classList.remove('hidden');
    }

    // 3. Gestionar los estilos de los botones
    const botones = document.querySelectorAll('button[data-vista]');
    botones.forEach(btn => {
        if (btn.getAttribute('data-vista') === nombreVista) {
            // Aplicar estilo activo
            btn.classList.add('nav-btn-active');
            btn.classList.remove('nav-btn-inactive');
        } else {
            // Aplicar estilo inactivo
            btn.classList.remove('nav-btn-active');
            btn.classList.add('nav-btn-inactive');
        }
    });

    localStorage.setItem('app_ultima_vista', nombreVista);
}

window.cargarDatosGlobales();