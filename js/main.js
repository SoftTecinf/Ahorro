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
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Inicializando aplicación...");
    await cargarDatosGlobales(); // Llama a tu función de api.js
    
    // Ahora que los datos están cargados, inicializa tu vista
    if (typeof cargarVista === 'function') {
        cargarVista('inicio');
    }
});