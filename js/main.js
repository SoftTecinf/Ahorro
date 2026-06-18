

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
    const modalLogin = document.getElementById('modal-identidad');
    const appContainer = document.getElementById('app-container');
    
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
window.onload = async function () {
    // Esperamos un poquito a que la app cargue los datos de internet
    await window.cargarDatosGlobales(); 

    // Ahora sí, buscamos la variable que SÍ existe en tu LocalStorage
    const usuarioGuardado = localStorage.getItem('app_currentUser');

    if (usuarioGuardado) {
        console.log("🔑 [DEBUG] Sesión encontrada para:", usuarioGuardado);
        
        // Obtenemos la lista que ya descargamos
        const lista = window.obtenerListaFamiliares();
        
        // Verificamos si Elena está en esa lista
        const existeUsuario = lista.some(f => f.nombre === usuarioGuardado);

        if (existeUsuario) {
            console.log("✅ [DEBUG] ¡Coincidencia! Entrando directo...");
            // AQUÍ LLAMA A TU FUNCIÓN QUE OCULTA EL LOGIN (ej. mostrarPantallaApp())
            document.getElementById('pantalla-login').style.display = 'none';
            document.getElementById('pantalla-principal').style.display = 'block';
        } else {
            console.log("❌ [DEBUG] El usuario guardado no coincide con la lista.");
        }
    } else {
        console.log("ℹ️ [DEBUG] No hay usuario guardado.");
    }
};
