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
function navegarA(idSeccion) {
    // 1. Ocultar todas las secciones (usando una clase común si las tienes)
    const secciones = ['sec-inicio', 'sec-datos', 'sec-configuracion'];
    
    secciones.forEach(secId => {
        const elemento = document.getElementById(secId);
        if (elemento) {
            elemento.classList.add('hidden');
        }
    });

    // 2. Mostrar la sección seleccionada
    const seccionActiva = document.getElementById(idSeccion);
    if (seccionActiva) {
        seccionActiva.classList.remove('hidden');
    }

    // 3. (Opcional) Cambiar el estilo de los botones del menú
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-blue-500', 'text-white'));
    const btnActivo = document.getElementById('btn-' + idSeccion.replace('sec-', ''));
    if (btnActivo) {
        btnActivo.classList.add('bg-gradient-to-r', 'from-purple-600', 'to-blue-500', 'text-white');
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
async function cargarVista(nombreVista) {
    const contenedor = document.getElementById('contenedor-vistas');

    try {
        // Carga el archivo .html correspondiente
        const respuesta = await fetch(`${nombreVista}.html`);
        const html = await respuesta.text();

        // Inyecta el contenido en el contenedor
        contenedor.innerHTML = html;

        // IMPORTANTE: Si la vista requiere lógica (ej. llenar tablas), 
        // debes llamar a la función específica aquí
        if (nombreVista === 'datos') inicializarTablaDatos();
    } catch (error) {
        console.error("Error cargando la vista:", error);
    }
}

// Escucha los clicks del menú
document.querySelectorAll('nav button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const vista = e.target.dataset.vista; // Asegúrate de poner data-vista="inicio" en tus botones
        cargarVista(vista);
    });
});

// Al final de tu archivo js/main.js
document.addEventListener("DOMContentLoaded", inicializarApp);