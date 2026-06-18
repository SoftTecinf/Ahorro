

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
    // 2. Definimos elementos
    const appContainer = document.getElementById('app-container');
    const modalLogin = document.getElementById('modal-identidad');
    
    // 3. Verificamos sesión
    const usuarioGuardado = localStorage.getItem('app_currentUser');
    const esValido = usuarioGuardado && familiares?.some(f => f.nombre === usuarioGuardado);
    
    // 4. ENCENDEMOS LA VISTA CORRECTA (Usando la clase .visible del CSS)
    if (esValido) {
        console.log("Sesión válida detectada para:", usuarioGuardado);
        if (modalLogin) modalLogin.classList.remove('visible'); // <-- Quitamos la visibilidad
        if (appContainer) appContainer.style.display = 'block';
        
        const label = document.getElementById('user-label');
        if (label) label.textContent = usuarioGuardado;
        
        await navegarA('inicio');
    } else {
        if (appContainer) appContainer.style.display = 'none';
        if (modalLogin) modalLogin.classList.add('visible'); // <-- ¡Aquí activamos la magia!
    }
});


// main.js
async function navegarA(vistaId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

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
                const response = await fetch(`${vistaId}.html`);
                const html = await response.text();
                contenedor.innerHTML = html;
           
        }

        // 4. Hacer visible el contenedor
        contenedor.classList.remove('hidden');
        contenedor.style.display = 'block'; // Forzamos visibilidad
    } else {
        console.error("No se encontró el contenedor con ID:", vistaId);
    }
}

// 1. Inicia la descarga en segundo plano
window.cargarDatosGlobales();

// 2. El Portero: Este se ejecuta cuando la página ya cargó
window.onload = function() {
    console.log("🕵️‍♀️ [DEBUG] Revisando si hay sesión guardada...");
    
    const usuarioGuardado = localStorage.getItem('usuarioActivo');
    
    if (usuarioGuardado) {
        console.log("📍 [DEBUG] Se encontró este usuario en memoria:", usuarioGuardado);
        
        // Aquí verificamos contra los datos que ya debieron cargar
        const lista = window.obtenerListaFamiliares();
        console.log("📊 [DEBUG] Lista actual en memoria:", lista);

        if (lista.some(u => u.nombre === usuarioGuardado)) {
            console.log("✅ [DEBUG] ¡Coincidencia encontrada! Saltando al inicio...");
            // AQUÍ LLAMAS A TU FUNCIÓN QUE MUESTRA LA APP
        } else {
            console.log("❌ [DEBUG] El usuario guardado ya no existe en la lista.");
        }
    } else {
        console.log("ℹ️ [DEBUG] No hay usuario guardado, toca iniciar sesión manual.");
    }
};

