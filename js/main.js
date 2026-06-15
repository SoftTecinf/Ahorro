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
// main.js - Modifica tu DOMContentLoaded así:
document.addEventListener('DOMContentLoaded', async () => {
    const usuarioActual = localStorage.getItem('app_currentUser');
    const modal = document.getElementById('modal-identidad');

    if (!usuarioActual) {
        // NO hay usuario: Ocultamos todo y mostramos el Login
        document.querySelectorAll('.vista').forEach(v => v.classList.add('hidden'));
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
        }
    } else {
        // SÍ hay usuario: Iniciamos la App y cargamos la vista por defecto
        document.getElementById('user-label').textContent = usuarioActual;
        await navegarA('inicio'); // Esto carga el contenido y lo muestra
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
    // 1. Pregunta de confirmación (Agregamos esto para evitar cierres accidentales)
    if (!confirm("¿Estás seguro de que quieres cerrar tu sesión?")) {
        return;
    }

    // 2. Borrado total de estado
    localStorage.removeItem('app_currentUser');
    localStorage.removeItem('app_ultima_vista');
    
    // 3. Recarga limpia
    window.location.reload(); 
};