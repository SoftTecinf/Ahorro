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
    // ... tu lógica actual de carga y login ...

    // AQUÍ ES DONDE DEBEN IR:
    document.getElementById('btn-inicio').addEventListener('click', () => navegarA('inicio'));
    document.getElementById('btn-datos').addEventListener('click', () => navegarA('datos'));
    document.getElementById('btn-configurar').addEventListener('click', () => navegarA('configurar'));
    
    // Y si quieres que la App cargue Inicio por defecto al abrir:
    await navegarA('inicio'); 
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