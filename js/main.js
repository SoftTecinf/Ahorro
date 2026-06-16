

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
       const ultimaVista = localStorage.getItem('app_ultima_vista') || 'inicio';
    navegarA(ultimaVista);
    }
});



// main.js
async function navegarA(nombreVista) {
    console.log("Navegando a:", nombreVista);

    // 1. Ocultar todos los contenedores principales
    document.querySelectorAll('.vista').forEach(v => {
        v.classList.add('hidden');
        v.style.display = 'none';
    });

    const contenedor = document.getElementById(nombreVista);

    if (contenedor) {
        // 2. Solo cargamos si está vacío
        if (contenedor.innerHTML.trim() === "") {
            try {
                const respuesta = await fetch(`${nombreVista}.html`);
                const texto = await respuesta.text();
                
                // Limpiamos el HTML recibido para no tener IDs duplicados
                // Solo inyectamos el contenido interno de la sección
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = texto;
                const contenidoReal = tempDiv.querySelector('section') || tempDiv.firstElementChild;
                
                contenedor.innerHTML = contenidoReal.innerHTML;
            } catch (error) {
                console.error("Error al cargar:", error);
            }
        }
        
        // 3. Mostramos el contenedor padre
        contenedor.classList.remove('hidden');
        contenedor.style.display = 'block';
    }
}

// ESTA LÍNEA VA FUERA DE LA FUNCIÓN
window.onload = () => navegarA('inicio');

window.cargarDatosGlobales();