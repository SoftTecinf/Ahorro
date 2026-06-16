

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
    // 1. Cargar el HTML
    try {
        const respuesta = await fetch(`${nombreVista}.html`);
        const html = await respuesta.text();
        document.getElementById('contenedor-vistas').innerHTML = html;
        localStorage.setItem('app_ultima_vista', nombreVista);
    } catch (error) {
        console.error("Error al cargar la vista:", error);
    }

    // 2. Cambiar estilos de botones
    // Seleccionamos todos los botones dentro del nav
    const botones = document.querySelectorAll('nav button');
    
    botones.forEach(btn => {
        // Obtenemos la vista a la que apunta el botón (usando el onclick o el data-vista)
        // Aquí comparamos si el atributo coincide con la vista cargada
        if (btn.getAttribute('data-vista') === nombreVista) {
            btn.className = btn.className.replace('nav-btn-inactive', '') + ' nav-btn-active';
        } else {
            btn.className = btn.className.replace('nav-btn-active', '') + ' nav-btn-inactive';
        }
    });
}

window.cargarDatosGlobales();