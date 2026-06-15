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
// En main.js (al final del archivo)
document.addEventListener('DOMContentLoaded', () => {
    const usuarioActual = localStorage.getItem('app_currentUser');
    const modal = document.getElementById('modal-identidad');
    
    console.log("Verificando sesión. Usuario actual:", usuarioActual);

    if (!usuarioActual) {
        console.log("No hay sesión, forzando aparición del login...");
        if (modal) {
            modal.classList.remove('hidden'); // Esto quita el 'hidden'
            modal.style.display = 'flex';     // Fuerza el estilo visual
        }
    } else {
        document.getElementById('user-label').textContent = usuarioActual;
    }
});


// En js/main.js
window.cargarVista = function(nombreVista) {
    console.log("Cambiando a vista:", nombreVista);
    
    // 1. Ocultar todas las vistas
    document.querySelectorAll('.vista').forEach(v => v.classList.add('hidden'));
    
    // 2. Mostrar la vista seleccionada
    const vista = document.getElementById('vista-' + nombreVista);
    if (vista) {
        vista.classList.remove('hidden');
    } else {
        console.error("No se encontró la vista:", nombreVista);
    }
    
    // 3. Lógica extra para modales (opcional)
    if (nombreVista === 'login' || nombreVista === 'registro') {
        document.getElementById('vista-login').classList.toggle('hidden', nombreVista !== 'login');
        document.getElementById('vista-registro').classList.toggle('hidden', nombreVista !== 'registro');
    }
};