let familiares = JSON.parse(localStorage.getItem('app_familiares')) || [];
let proyectos = [];
let cuentasBancarias = [];
let invitacionesPendientes = [];
let currentUser = localStorage.getItem('app_currentUser') || '';
let cacheProyectos = [];
let cacheCuentas = [];
let datosCargados = false;


// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM listo. Iniciando aplicación...");
    // Solo ahora intenta mostrar el modal o la vista
    if (document.getElementById('modal-identidad')) {
        // Tu lógica de mostrar modal
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


/// En js/main.js
// js/main.js
// js/main.js
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargamos datos de una sola vez
    await cargarDatosGlobales();
    
    // 2. Solo después de cargar, mostramos la vista inicial
    cargarVista('inicio');
});

// Listener de navegación
// En js/main.js

