

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
    console.log("Cambiando a vista:", nombreVista);

    // 1. Ocultar TODAS las vistas
    const vistas = document.querySelectorAll('.vista');
    vistas.forEach(v => v.classList.add('hidden'));

    // 2. Mostrar SOLO la vista seleccionada
    // Nota: El ID en tu HTML es 'vista-datos', así que nombreVista debe coincidir
    const vistaACargar = document.getElementById(`vista-${nombreVista}`);
    if (vistaACargar) {
        vistaACargar.classList.remove('hidden');
    }

    // 3. Gestionar botones (la lógica que ya tenías)
    const botones = document.querySelectorAll('button[data-vista]');
    botones.forEach(btn => {
        btn.classList.remove('nav-btn-active');
        btn.classList.add('nav-btn-inactive');
    });

    const botonActual = document.querySelector(`button[data-vista="${nombreVista}"]`);
    if (botonActual) {
        botonActual.classList.remove('nav-btn-inactive');
        botonActual.classList.add('nav-btn-active');
    }

    localStorage.setItem('app_ultima_vista', nombreVista);
}

window.cargarDatosGlobales();