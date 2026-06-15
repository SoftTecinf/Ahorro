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
    // 1. DIBUJO INMEDIATO: Carga lo que tengas guardado en el navegador
    const datosGuardados = localStorage.getItem('app_familiares');
    if (datosGuardados) {
        window.familiares = JSON.parse(datosGuardados);
        console.log("Carga inmediata desde caché");
    }

    // 2. VERIFICACIÓN DE SESIÓN (Inmediata también)
    const usuarioActual = localStorage.getItem('app_currentUser');
    const modal = document.getElementById('modal-identidad');

    if (!usuarioActual) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    } else {
        document.getElementById('user-label').textContent = usuarioActual;
    }

    // 3. ACTUALIZACIÓN EN SEGUNDO PLANO (Silenciosa)
    // Esto asegura que si alguien cambió algo en el Sheet, se actualice sin que el usuario lo note
    cargarDatosGlobales().then(() => {
        console.log("Datos sincronizados con Google en segundo plano");
    });
});


// En js/main.js
window.cargarVista = (nombreVista) => {
    // 1. Primero, ocultamos todas las vistas usando un selector general
    const todasLasVistas = document.querySelectorAll('.vista');
    todasLasVistas.forEach(v => {
        v.classList.add('hidden');
        v.style.display = 'none'; // Forzamos el ocultado por CSS
    });

    // 2. Buscamos específicamente la vista que queremos mostrar
    const vistaDestino = document.getElementById('vista-' + nombreVista);
    
    if (vistaDestino) {
        // 3. Quitamos las clases y estilos que la mantienen oculta
        vistaDestino.classList.remove('hidden');
        vistaDestino.style.display = 'block'; // Forzamos la visibilidad
        console.log("Vista cargada con éxito:", nombreVista);
    } else {
        console.error("Error: No se encontró el elemento con ID: vista-" + nombreVista);
    }
};