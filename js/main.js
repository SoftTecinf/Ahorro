

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
// Variable global para saber si estamos listos
window.appReady = false;

window.addEventListener('DOMContentLoaded', async () => {
    // 1. CARGA DE DATOS OBLIGATORIA
    await cargarDatosGlobales(); 
    window.appReady = true;

    // 2. DECISIÓN INMEDIATA (Sin navegar todavía)
    const modal = document.getElementById('modal-identidad');
    const usuarioGuardado = localStorage.getItem('app_currentUser');
    const esValido = usuarioGuardado && window.familiares.some(f => f.nombre === usuarioGuardado);

    if (esValido) {
        // Usuario ya logueado
        document.getElementById('user-label').textContent = usuarioGuardado;
        modal.classList.remove('visible'); // Ocultar login
        await navegarA('inicio');          // Cargar vista
    } else {
        // Usuario no logueado
        modal.classList.add('visible');    // Mostrar login
    }
});


// main.js
async function navegarA(vistaId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    console.log("Navegando a:", vistaId);

    // 1. Ocultar todas las vistas (añadir 'hidden')
    document.querySelectorAll('.vista').forEach(v => {
        v.classList.add('hidden');
        v.style.display = 'none';
    });

    // 2. Localizar el contenedor
    const contenedor = document.getElementById(vistaId);

    if (contenedor) {
        // 3. Cargar contenido solo si está vacío
        if (contenedor.innerHTML.trim() === "") {
            try {
                const response = await fetch(`${vistaId}.html`);
                const html = await response.text();
                contenedor.innerHTML = html;
                console.log("Contenido cargado para:", vistaId);
            } catch (err) {
                console.error("Error al cargar la vista:", err);
            }
        }

        // 4. Hacer visible el contenedor
        contenedor.classList.remove('hidden');
        contenedor.style.display = 'block'; // Forzamos visibilidad
        console.log("Vista mostrada exitosamente");
    } else {
        console.error("No se encontró el contenedor con ID:", vistaId);
    }
}

// ESTA LÍNEA VA FUERA DE LA FUNCIÓN
window.onload = async function () {
    const usuarioGuardado = localStorage.getItem('usuarioActivo');

    if (usuarioGuardado) {
        // Validamos con Google Apps Script si el usuario sigue siendo válido
        google.script.run
            .withSuccessHandler(validado => {
                if (validado) {
                    console.log("Sesión validada por el servidor");
                    // Aquí restauras tu vista (ej. navegarA('inicio'))
                } else {
                    localStorage.removeItem('usuarioActivo');
                    // Redirigir al login
                }
            })
            .validarSesionServidor(usuarioGuardado); // Esta función debe existir en Code.gs
    }
};



window.cargarDatosGlobales();