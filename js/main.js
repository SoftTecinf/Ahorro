

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
window.appReady = false;

window.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 El script arrancó correctamente");
    
    // 1. Cargamos datos de forma segura
    await cargarDatosGlobales();
    
    // 2. Definimos elementos
    const appContainer = document.getElementById('app-container');
    const modalLogin = document.getElementById('modal-identidad');
    
    // 3. Verificamos sesión (CORREGIDO: Quitamos 'window.')
    const usuarioGuardado = localStorage.getItem('app_currentUser');
    const esValido = usuarioGuardado && familiares?.some(f => f.nombre === usuarioGuardado);
    
    // 4. ENCENDEMOS LA VISTA CORRECTA (Con escudos protectores contra nulos)
    if (esValido) {
        console.log("Sesión válida detectada para:", usuarioGuardado);
        if (modalLogin) modalLogin.style.display = 'none';
        if (appContainer) appContainer.style.display = 'block';
        
        const label = document.getElementById('user-label');
        if (label) label.textContent = usuarioGuardado;
        
        await navegarA('inicio');
    } else {
        console.log("Sin sesión activa o usuario inválido. Mostrando Login.");
        if (appContainer) appContainer.style.display = 'none';
        if (modalLogin) modalLogin.style.display = 'flex';
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

