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
// En js/main.js
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Aseguramos que los datos se carguen sí o sí
    await cargarDatosGlobales(); 
    
    // 2. Una vez cargados, verificamos la sesión
    const usuarioActual = localStorage.getItem('app_currentUser');
    if (!usuarioActual) {
        document.getElementById('modal-identidad').classList.remove('hidden');
    } else {
        document.getElementById('user-label').textContent = usuarioActual;
    }
});


// En js/main.js
window.cargarVista = function(nombreVista) {
    console.log("Cambiando a vista:", nombreVista);
    document.querySelectorAll('.vista').forEach(v => v.classList.add('hidden'));
    const vista = document.getElementById('vista-' + nombreVista);
    if (vista) vista.classList.remove('hidden');
};