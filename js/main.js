console.log("--- INICIO DE CARGA ---");
console.log("¿Existe usuario en LocalStorage?:", localStorage.getItem('app_currentUser'));
console.log("URL actual:", window.location.href);


let familiares = JSON.parse(localStorage.getItem('app_familiares')) || [];
let proyectos = [];
let cuentasBancarias = [];
let invitacionesPendientes = [];
let currentUser = localStorage.getItem('app_currentUser') || '';
let cacheProyectos = [];
let cacheCuentas = [];
let datosCargados = false;

// ==========================================
// CONTROL DE NAVEGACIÓN ENTRE SECCIONES
// ==========================================
// ==========================================
async function cargarDatosGlobales() {
    if (datosCargados) return; // Si ya se cargaron, no vuelvas a pedir a Sheety

    try {
        const [resP, resC] = await Promise.all([
            fetch('https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/proyectos'),
            fetch('https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/cuentas')
        ]);
        
        const dataP = await resP.json();
        const dataC = await resC.json();
        
        cacheProyectos = dataP.proyectos || [];
        cacheCuentas = dataC.cuentas || [];
        datosCargados = true;
        console.log("Datos cargados correctamente");
    } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
    }
}

// js/main.js
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargamos datos de base (Esto es asíncrono)
    await cargarDatosGlobales();
    
    // 2. VERIFICACIÓN DE GUARDIA: ¿Hay usuario?
    const usuarioGuardado = localStorage.getItem('app_currentUser');
    
    if (usuarioGuardado) {
        currentUser = usuarioGuardado;
        actualizarLabelUsuario();
        await cargarVista('inicio'); // Carga segura
    } else {
        // Si no hay usuario, forzamos el LOGIN
        await cargarVista('login'); 
    }
});

function cargarVista(nombre) {
    console.log("Cambiando a vista:", nombre);
    
    // 1. Oculta todas las secciones que tengan la clase 'vista'
    document.querySelectorAll('.vista').forEach(v => v.classList.add('hidden'));
    
    // 2. Muestra solo la solicitada
    const vistaDestino = document.getElementById(`vista-${nombre}`);
    if (vistaDestino) {
        vistaDestino.classList.remove('hidden');
        // Ejecuta la lógica correspondiente sin recargar
        actualizarLabelUsuario();
        if (nombre === 'inicio') renderizarInicioProyectos();
        if (nombre === 'datos') renderizarGridProyectos();
        if (nombre === 'config') actualizarSelectoresConfig();
    }
}

// ==========================================
// INICIALIZACIÓN UNIFICADA DE LA APP
// ==========================================
// 1. Asegúrate de que esta función sea global y robusta
function actualizarLabelUsuario() {
    const label = document.getElementById('user-label');
    if (label) {
        label.textContent = currentUser || "No identificado";
    } else {
        // Si el label no existe, reintenta en 500ms (útil para vistas dinámicas)
        setTimeout(actualizarLabelUsuario, 500);
    }
}
/// En js/main.js
// js/main.js
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargamos datos
    await cargarDatosGlobales();
    
    // 2. Verificamos sesión
    const usuario = localStorage.getItem('app_currentUser');
    
    // 3. Decidimos qué vista mostrar
    if (usuario) {
        currentUser = usuario;
        cargarVista('inicio'); // No uses 'await' aquí, ya no es fetch
    } else {
        cargarVista('login');
    }
});

// Listener de navegación
// En js/main.js

