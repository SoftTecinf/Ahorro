// ==========================================
// VARIABLES GLOBALES (Ahora se llenarán desde la nube)
// ==========================================
let familiares = JSON.parse(localStorage.getItem('app_familiares')) || [];
let proyectos = [];
let cuentasBancarias = [];
let invitacionesPendientes = [];
let currentUser = localStorage.getItem('app_currentUser') || '';

// ==========================================
// CONTROL DE NAVEGACIÓN ENTRE SECCIONES
// ==========================================
// ==========================================
// NUEVA NAVEGACIÓN DINÁMICA (Sustituye a navegarA)
// ==========================================
async function cargarVista(nombreVista) {
    const contenedor = document.getElementById('contenedor-vistas');
    
    try {
        // 1. CARGAR HTML
        const respuesta = await fetch(`${nombreVista}.html`);
        if (!respuesta.ok) throw new Error(`No se pudo encontrar ${nombreVista}.html`);
        const html = await respuesta.text();
        contenedor.innerHTML = html;
        
        // 2. MOSTRAR DISEÑO (Quitar hidden)
        contenedor.querySelectorAll('.hidden').forEach(el => el.classList.remove('hidden'));

        // 3. EJECUTAR LÓGICA (Separada en un try/catch propio)
        try {
            if (nombreVista === 'inicio') await renderizarInicioProyectos();
            if (nombreVista === 'datos') await renderizarGridProyectos();
            if (nombreVista === 'config') await actualizarSelectoresConfig();
        } catch (logicError) {
            console.error("Error en la lógica de la vista:", logicError);
            // Aquí el HTML ya está cargado, así que el usuario ve el diseño aunque la API falle
        }

    } catch (fetchError) {
        contenedor.innerHTML = `<p class="text-red-500">Error: ${fetchError.message}</p>`;
    }
}

// ==========================================
// INICIALIZACIÓN UNIFICADA DE LA APP
// ==========================================
function inicializarApp() {
    if (familiares.length > 0 && typeof familiares[0] === 'string') {
        familiares = familiares.map(fName => ({ nombre: fName, celular: "", password: "123" }));
        localStorage.setItem('app_familiares', JSON.stringify(familiares));
    }

    actualizarLabelUsuario();

    const urlParams = new URLSearchParams(window.location.search);
    const idProyectoInvitacion = urlParams.get('proyecto');
    if (idProyectoInvitacion) {
        sessionStorage.setItem('pending_proyecto', idProyectoInvitacion);
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const modalIdentidad = document.getElementById('modal-identidad');

    if (currentUser) {
        if (modalIdentidad) modalIdentidad.classList.add('hidden');
        procesarInvitacionPendiente();
        navegarA('sec-inicio');
    } else {
        if (modalIdentidad) modalIdentidad.classList.remove('hidden');
        cambiarVista('login');
    }
}

// main.js
// En js/main.js - Asegúrate de que esto esté fuera de cualquier función
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargamos el usuario primero
    verificarSesion(); 
    
    // 2. Cargamos la vista inicial
    cargarVista('inicio');
});

// Listener de navegación
document.addEventListener('click', (e) => {
    const boton = e.target.closest('[data-vista]');
    if (boton) {
        cargarVista(boton.dataset.vista);
    }
});