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
        // 1. Cargar el HTML
        const respuesta = await fetch(`${nombreVista}.html`);
        const html = await respuesta.text();
        
        // Inyectamos el contenido
        contenedor.innerHTML = html;

        // --- FUERZA BRUTA: Eliminamos cualquier clase 'hidden' inmediatamente ---
        const elementosOcultos = contenedor.querySelectorAll('.hidden');
        elementosOcultos.forEach(el => el.classList.remove('hidden'));

        // 2. Lógica de botones (navegación)
        document.querySelectorAll('nav button').forEach(btn => 
            btn.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-blue-500', 'text-white')
        );
        const btnActivo = document.querySelector(`[data-vista="${nombreVista}"]`);
        if (btnActivo) btnActivo.classList.add('bg-gradient-to-r', 'from-purple-600', 'to-blue-500', 'text-white');

        // 3. Renderizado de datos (Asegúrate de que esto no borre el diseño)
        actualizarLabelUsuario();
        
        // Pasamos a las funciones de renderizado
        if (nombreVista === 'inicio') await renderizarInicioProyectos();
        if (nombreVista === 'datos') await renderizarGridProyectos();
        if (nombreVista === 'config') await actualizarSelectoresConfig();
        
    } catch (error) {
    console.error("DETALLE DEL ERROR:", error); // Esto mostrará el error real en la consola F12
    contenedor.innerHTML = `<p class="p-4 text-red-500">Error al cargar la sección: ${error.message}</p>`;
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