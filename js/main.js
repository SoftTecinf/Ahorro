

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

// ESTA LÍNEA VA FUERA DE LA FUNCIÓN
window.onload = async function () {
    // 1. Buscamos si hay un nombre de usuario guardado en la libreta del celular/PC
    const usuarioGuardado = localStorage.getItem('usuarioActivo');

    if (usuarioGuardado) {
        console.log("🔑 [Persistent-Login] Sesión detectada para:", usuarioGuardado);
        
        // 2. Traemos la lista de familiares que ya tenemos en caché para confirmar que existe
        const listaFamiliares = window.obtenerListaFamiliares();
        
        // 3. Verificamos si ese usuario sigue estando en la lista de la app
        const existeUsuario = listaFamiliares.some(f => f.nombre === usuarioGuardado);

        if (existeUsuario) {
            console.log("✅ Usuario confirmado en memoria. Saltando Login...");
            
            // 🚀 AQUÍ PON EN LUGAR DE ESTAS LÍNEAS TU FUNCIÓN PARA MOSTRAR LA APP (ej. navegarA('inicio'))
            if (document.getElementById('pantalla-login')) {
                document.getElementById('pantalla-login').style.display = 'none';
            }
            if (document.getElementById('pantalla-principal')) {
                document.getElementById('pantalla-principal').style.display = 'block';
            }
            
        } else {
            // Si por algo borraste a ese usuario de la Sheet, lo sacamos por seguridad
            console.warn("⚠️ El usuario ya no existe en la base de datos. Limpiando...");
            localStorage.removeItem('usuarioActivo');
        }
    }
};

