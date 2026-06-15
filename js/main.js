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
    if (!usuarioActual) {
        console.log("No hay sesión, mostrando login...");
        document.getElementById('modal-identidad').classList.remove('hidden');
    } else {
        document.getElementById('user-label').textContent = usuarioActual;
    }
});

if (typeof window.cargarVista === 'function') {
    window.cargarVista = function(nombreVista) {
    console.log("Cargando vista:", nombreVista);
    // ... aquí va toda tu lógica para ocultar/mostrar elementos
};
} else {
    console.warn("cargarVista aún no está disponible, intentando recargar...");
    setTimeout(() => { if (window.cargarVista) window.cargarVista('inicio'); }, 500);
}