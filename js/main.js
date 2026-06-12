let familiares = JSON.parse(localStorage.getItem('app_familiares')) || [];
let proyectos = [];
let cuentasBancarias = [];
let invitacionesPendientes = [];
let currentUser = localStorage.getItem('app_currentUser') || '';
let cacheProyectos = [];
let cacheCuentas = [];
let datosCargados = false;



// js/main.js
document.addEventListener('DOMContentLoaded', async () => {
    await cargarDatosGlobales();
    
    // Si no hay usuario en localStorage, forzamos el login
    const usuarioActual = localStorage.getItem('app_currentUser');
    if (!usuarioActual) {
        // Aquí mostramos tu modal de login/registro
        const modal = document.getElementById('modal-identidad');
        if (modal) modal.classList.remove('hidden');
    } else {
        cargarVista('inicio');
    }
});


// ==========================================
// INICIALIZACIÓN UNIFICADA DE LA APP
// ==========================================
// 1. Asegúrate de que esta función sea global y robusta
// En main.js (o donde esté tu función)
function actualizarLabelUsuario() {
    const label = document.getElementById('user-label');
    const usuario = localStorage.getItem('app_currentUser');

    if (label) {
        label.innerText = usuario ? usuario : "Invitado";
    }
}

// js/main.js
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargamos datos de una sola vez
    await cargarDatosGlobales();
    
    // 2. Solo después de cargar, mostramos la vista inicial
    cargarVista('inicio');
});

window.cargarVista = function(nombreVista) {
    // Tu lógica para ocultar y mostrar vistas
    const vistas = document.querySelectorAll('.vista');
    vistas.forEach(v => v.classList.add('hidden'));
    const vistaActiva = document.getElementById('vista-' + nombreVista);
    if (vistaActiva) {
        vistaActiva.classList.remove('hidden');
    }
};