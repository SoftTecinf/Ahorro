

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
    console.log("Cargando vista:", nombreVista);

    try {
        const respuesta = await fetch(`${nombreVista}.html`);
        const html = await respuesta.text();

        const contenedor = document.getElementById('contenedor-vistas');
        
        if (contenedor) {
            // AQUÍ LA PRUEBA: inyectamos el HTML recibido
            contenedor.innerHTML = html;
            console.log("HTML inyectado en el contenedor.");
        } else {
            console.error("NO ENCONTRÉ 'contenedor-vistas'");
        }

        // ... resto de tu lógica de botones
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}
window.cargarDatosGlobales();