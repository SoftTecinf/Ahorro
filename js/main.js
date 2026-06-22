

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
// En tu main.js, dentro del DOMContentLoaded
const appContainer = document.getElementById('app-container');
const modalLogin = document.getElementById('modal-identidad');

// Verificamos si el usuario existe en el localStorage
const usuarioGuardado = localStorage.getItem('app_currentUser');
// Usamos tu función obtenerListaFamiliares() que ya tiene el plan B del caché
const lista = window.obtenerListaFamiliares(); 
const esValido = usuarioGuardado && lista.some(f => f.nombre === usuarioGuardado);

if (esValido) {    
    // 2. Si encontramos app-container, lo mostramos
    if (appContainer) {
        appContainer.style.display = 'block'; 
        console.log("-> app-container visible");
    } else {
        console.error("❌ No se encontró el elemento 'app-container' en el HTML.");
    }
    
    // 3. Si encontramos modalLogin, lo ocultamos
    if (modalLogin) {
        modalLogin.style.display = 'none';
        console.log("-> modal-identidad oculto");
    }
    
    // 4. Actualizamos el nombre
    const label = document.getElementById('user-label');
    if (label) label.textContent = usuarioGuardado;
    
    // 5. Navegamos al inicio
    await navegarA('inicio');
} else {
    
    // FORZAMOS LA VISIBILIDAD DEL LOGIN
    const modalLogin = document.getElementById('modal-identidad');
    const appContainer = document.getElementById('app-container');
    
    if (modalLogin) {
        modalLogin.style.display = 'flex'; // ¡Forzamos que se vea!
        modalLogin.classList.add('visible'); // Por si usas clases también
    }
    if (appContainer) {
        appContainer.style.display = 'none'; // Aseguramos que la app esté oculta
    }
}
});


// main.js
async function navegarA(vistaId) {
    console.log("-> Navegando a:", vistaId);

    // 1. Quitamos la clase 'hidden' y forzamos el display a 'block' para TODAS las vistas
    //    Esto es para resetear el estado de todas.
    document.querySelectorAll('.vista').forEach(v => {
        v.classList.add('hidden'); // Ocultamos todas
        v.style.display = 'none';  // Forzamos el ocultado
    });

    // 2. Buscamos el contenedor que queremos mostrar
    const contenedor = document.getElementById(vistaId);

    if (contenedor) {
        // 3. Cargamos contenido si está vacío
        if (contenedor.innerHTML.trim() === "") {
            try {
                const response = await fetch(`${vistaId}.html`);
                const html = await response.text();
                contenedor.innerHTML = html;
            } catch (err) { console.error("Error:", err); }
        }

        // 4. ¡AQUÍ ESTÁ EL CAMBIO IMPORTANTE!
        //    Eliminamos la clase 'hidden' y borramos el estilo 'display'
        //    para que el navegador tome el control total.
        contenedor.classList.remove('hidden');
        contenedor.style.removeProperty('display'); 
        
        console.log("-> Vista mostrada:", vistaId);
    }
}

// 1. Inicia la descarga en segundo plano
window.cargarDatosGlobales();

// 2. El Portero: Este se ejecuta cuando la página ya cargó
window.onload = async function () {
    // 1. Cargamos datos
    await window.cargarDatosGlobales(); 

    // 2. Verificamos sesión
    const usuarioGuardado = localStorage.getItem('app_currentUser');
    if (usuarioGuardado) {
        console.log("🔑 [DEBUG] Sesión encontrada para:", usuarioGuardado);
        
        const lista = window.obtenerListaFamiliares();
        const existeUsuario = lista.some(f => f.nombre === usuarioGuardado);

        if (existeUsuario) {
            console.log("✅ [DEBUG] ¡Coincidencia! Entrando directo...");
            
            // --- AQUÍ ESTÁ EL AJUSTE ---
            // Usamos los IDs que SÍ existen en tu HTML:
            const appContainer = document.getElementById('app-container');
            const modalIdentidad = document.getElementById('modal-identidad');
            
            if (appContainer) {
                appContainer.style.display = 'block'; // Mostramos la app
            }
            
            if (modalIdentidad) {
                modalIdentidad.style.display = 'none'; // Ocultamos el login
            }
            // ----------------------------
            
        } else {
            console.log("❌ [DEBUG] El usuario guardado no coincide.");
        }
    } else {
        console.log("ℹ️ [DEBUG] No hay usuario guardado.");
        // Aseguramos que el login esté visible y la app oculta
        document.getElementById('app-container').style.display = 'none';
        document.getElementById('modal-identidad').style.display = 'flex';
    }
};
