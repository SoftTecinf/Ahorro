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
    const usuario = localStorage.getItem('app_currentUser');
    
    if (!usuario) {
        // NO hay usuario: Forzamos el Login
        document.getElementById('modal-identidad').classList.remove('hidden');
    } else {
        // SÍ hay usuario: Iniciamos la app normalmente
        await navegarA('inicio');
    }
});



// main.js
async function navegarA(nombreVista) {
    const contenedor = document.getElementById(`vista-${nombreVista}`);

    // Si el contenido ya fue cargado, solo mostramos la vista
    if (contenedor.innerHTML.trim() !== "") {
        window.cargarVista(nombreVista);
        return;
    }

    // Si está vacío, traemos el archivo correspondiente
    try {
        console.log(`Cargando vista: ${nombreVista}.html`);
        const respuesta = await fetch(`${nombreVista}.html`);
        const html = await respuesta.text();

        // Inyectamos solo la sección principal
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const seccion = doc.querySelector('section');

        contenedor.innerHTML = seccion ? seccion.outerHTML : html;
        window.cargarVista(nombreVista);
    } catch (error) {
        console.error(`Error al cargar ${nombreVista}.html:`, error);
    }
}

window.cerrarSesion = () => {
    // 1. ELIMINAR LA IDENTIDAD (El usuario ya no existe para la app)
    localStorage.removeItem('app_currentUser');
    
    // 2. ELIMINAR EL ESTADO DE NAVEGACIÓN (Opcional: para que no recuerde dónde estaba)
    localStorage.removeItem('app_ultima_vista');
    
    // 3. RECARGAR LA PÁGINA O VOLVER AL LOGIN
    // La forma más segura de limpiar TODO el estado de la memoria es recargar
    window.location.reload(); 
};