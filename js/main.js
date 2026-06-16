

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

    // 1. Ocultar todos los divs que tienen la clase 'vista'
    const todasLasVistas = document.querySelectorAll('.vista');
    todasLasVistas.forEach(v => {
        v.classList.add('hidden');
        v.style.display = 'none'; // Asegura que se oculten
    });

    // 2. Mostrar SOLO el div que corresponde al nombre
    // Buscamos el elemento por su ID (ej: 'inicio', 'datos', 'config')
    const vistaACargar = document.getElementById(nombreVista);
    
    if (vistaACargar) {
        vistaACargar.classList.remove('hidden');
        vistaACargar.style.display = 'block'; // Asegura que se muestre
        console.log("Vista cargada correctamente:", nombreVista);
    } else {
        console.error("No se encontró ningún elemento con ID:", nombreVista);
    }

    // 3. (Opcional) Cambiar el estilo de los botones activos
    document.querySelectorAll('button[data-vista]').forEach(btn => {
        if (btn.getAttribute('data-vista') === nombreVista) {
            btn.classList.add('nav-btn-active');
            btn.classList.remove('nav-btn-inactive');
        } else {
            btn.classList.remove('nav-btn-active');
            btn.classList.add('nav-btn-inactive');
        }
    });
}

// Carga inicial al abrir la página
window.onload = () => {
    navegarA('inicio'); // Carga 'inicio' por defecto
};

window.cargarDatosGlobales();