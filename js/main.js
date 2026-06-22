

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
    console.log(`Intentando navegar a: ${vistaId}`);

    // 1. Ocultar todas las vistas de forma segura
    const todasLasVistas = document.querySelectorAll('.vista');
    todasLasVistas.forEach(vista => {
        vista.classList.add('hidden');
        vista.style.display = 'none';
    });

    // 2. Localizar el contenedor específico
    const contenedor = document.getElementById(vistaId);

    // 3. Blindaje: Solo si el contenedor existe, procedemos
    if (contenedor) {
        // Si la vista está vacía, cargamos el contenido
        if (contenedor.innerHTML.trim() === "") {
            try {
                const response = await fetch(`${vistaId}.html`);
                const html = await response.text();
                contenedor.innerHTML = html;
            } catch (err) {
                console.error("Error al cargar la vista:", err);
            }
        }
        
        // Hacemos visible la vista
        contenedor.classList.remove('hidden');
        contenedor.style.display = 'block';
    } else {
        console.error(`El contenedor con ID "${vistaId}" no existe en el HTML.`);
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
