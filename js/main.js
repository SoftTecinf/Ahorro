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
    // 1. Carga los datos (esto ya sabemos que funciona)
    await cargarDatosGlobales(); 
    
    // 2. Verificamos la sesión
    const usuarioActual = localStorage.getItem('app_currentUser');
    const modal = document.getElementById('modal-identidad');

    if (!usuarioActual) {
        // Aseguramos que el modal se muestre
        modal.classList.remove('hidden'); 
        // Si hay una clase de estilo display:none, fuérzala:
        modal.style.display = 'flex'; 
        console.log("Modal de login mostrado.");
    } else {
        document.getElementById('user-label').textContent = usuarioActual;
        modal.classList.add('hidden'); // Ocultamos el login si ya inició sesión
    }
    
    // 3. Quitamos el mensaje "Cargando..."
    const loadingLabel = document.querySelector('.cargando'); // Ajusta a tu clase real
    if (loadingLabel) loadingLabel.textContent = ""; 
});


// En js/main.js
window.cargarVista = function(nombreVista) {
    console.log("Cambiando a vista:", nombreVista);
    document.querySelectorAll('.vista').forEach(v => v.classList.add('hidden'));
    const vista = document.getElementById('vista-' + nombreVista);
    if (vista) vista.classList.remove('hidden');
};