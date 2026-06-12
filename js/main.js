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
window.cargarVista = function(nombreVista) {
    const vistas = document.querySelectorAll('.vista');
    vistas.forEach(v => v.classList.add('hidden'));
    const vistaActiva = document.getElementById('vista-' + nombreVista);
    if (vistaActiva) {
        vistaActiva.classList.remove('hidden');
    }
    // Actualizar botones de navegación si los tienes
    document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-blue-500', 'text-white');
        btn.classList.add('text-gray-500');
    });
    const btnActivo = document.getElementById('btn-' + nombreVista);
    if(btnActivo) {
        btnActivo.classList.add('bg-gradient-to-r', 'from-purple-600', 'to-blue-500', 'text-white');
        btnActivo.classList.remove('text-gray-500');
    }
};

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
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargamos datos una sola vez
    if (typeof cargarDatosGlobales === 'function') {
        await cargarDatosGlobales();
    }
    
    // 2. Solo después, verificamos si hay sesión
    const usuarioActual = localStorage.getItem('app_currentUser');
    if (!usuarioActual) {
        const modal = document.getElementById('modal-identidad');
        if (modal) modal.classList.remove('hidden'); // Esto debería mostrar tu login
    } else {
        cargarVista('inicio');
    }
});