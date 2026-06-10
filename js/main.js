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
    if (!contenedor) return;

    try {
        // 1. Cargar el HTML externo
        const respuesta = await fetch(`${nombreVista}.html`);
        const html = await respuesta.text();
        contenedor.innerHTML = html;

        // --- AQUÍ ESTÁ EL CAMBIO ---
        // Quitamos la clase 'hidden' al cargar cualquier vista
        const seccionActiva = contenedor.querySelector('.hidden');
        if (seccionActiva) seccionActiva.classList.remove('hidden');

        // 2. Actualizar estilos de los botones...
        // (Tu lógica actual de clases de botones)

        // 3. RE-INICIALIZAR LÓGICA SEGÚN LA VISTA
        actualizarLabelUsuario();

        if (nombreVista === 'inicio') renderizarInicioProyectos();
        if (nombreVista === 'datos') renderizarGridProyectos();
        if (nombreVista === 'config') {
            // Llamamos a la función que preparamos para Sheety
            actualizarSelectoresConfig(); 
        }
        
    } catch (error) {
        console.error("Error cargando la vista:", error);
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