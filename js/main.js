

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

    try {
        // 1. Intentar cargar el contenido externo (si los archivos existen)
        // Nota: Si los archivos NO existen en el servidor, esto dará error.
        const respuesta = await fetch(`${nombreVista}.html`);
        
        if (respuesta.ok) {
            const contenido = await respuesta.text();
            const contenedorDestino = document.getElementById(nombreVista);
            if (contenedorDestino) {
                contenedorDestino.innerHTML = contenido;
            }
        }
        // Si el archivo no existe, el código continúa igual para mostrar el div que ya tienes en el HTML.

        // 2. Ocultar todas las vistas
        document.querySelectorAll('.vista').forEach(v => {
            v.classList.add('hidden');
            v.style.display = 'none';
        });

        // 3. Mostrar la vista seleccionada
        const vistaACargar = document.getElementById(nombreVista);
        if (vistaACargar) {
            vistaACargar.classList.remove('hidden');
            vistaACargar.style.display = 'block';
        }

        // 4. Gestionar botones
        document.querySelectorAll('button[data-vista]').forEach(btn => {
            if (btn.getAttribute('data-vista') === nombreVista) {
                btn.classList.add('nav-btn-active');
                btn.classList.remove('nav-btn-inactive');
            } else {
                btn.classList.remove('nav-btn-active');
                btn.classList.add('nav-btn-inactive');
            }
        });

    } catch (error) {
        console.error("Error en navegación:", error);
    }
}

// ESTA LÍNEA VA FUERA DE LA FUNCIÓN
window.onload = () => navegarA('inicio');

window.cargarDatosGlobales();