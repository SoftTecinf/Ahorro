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
async function cargarVistaInicio() {
    const contenedor = document.getElementById('vista-inicio');
    // Solo cargamos si está vacío para no duplicar contenido
    if (contenedor.innerHTML.trim() === '<h2 class="text-xl font-bold">¡Bienvenido al Ahorro!</h2>') {
        const respuesta = await fetch('inicio.html');
        const contenido = await respuesta.text();
        contenedor.innerHTML = contenido;
    }
}

// Llama a esto justo después de iniciar sesión en tu auth.js
// await cargarVistaInicio();