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
    // En lugar de añadir eventos a cada botón, añadimos uno solo al contenedor padre
    const navContainer = document.querySelector('nav'); // Cambia 'nav' por el ID o clase de tu barra de menú si es necesario

    if (navContainer) {
        navContainer.addEventListener('click', (e) => {
            // Verificamos si el elemento clickeado es uno de nuestros botones
            const target = e.target.closest('button');
            if (!target) return;

            if (target.id === 'btn-inicio') navegarA('inicio');
            else if (target.id === 'btn-datos') navegarA('datos');
            else if (target.id === 'btn-configurar') navegarA('configurar');
        });
    } else {
        console.error("No se encontró el contenedor de navegación (nav). Verifica tu HTML.");
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

function cerrarSesion() {
    // 1. Limpiamos los datos del usuario
    localStorage.removeItem('app_currentUser');
    // Opcional: localStorage.removeItem('app_familiares'); 
    
    // 2. Ocultamos TODAS las vistas
    document.querySelectorAll('.vista').forEach(v => {
        v.classList.add('hidden');
        v.style.display = 'none';
    });

    // 3. Mostramos el modal de login
    const modal = document.getElementById('modal-identidad');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    console.log("Sesión cerrada correctamente.");
}
