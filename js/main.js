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
// En api.js, centraliza la carga
async function cargarDatosGlobales() {
    try {
        // Intentar descargar de la API
        const res = await fetch('https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/proyectos');
        if (!res.ok) throw new Error("API bloqueada");
        const datos = await res.json();
        
        // Guardar en localStorage para uso offline
        localStorage.setItem('datos_proyectos', JSON.stringify(datos));
        window.proyectos = datos;
    } catch (e) {
        // Si falla, usar lo que ya teníamos guardado
        console.warn("Usando datos locales por fallo de API");
        window.proyectos = JSON.parse(localStorage.getItem('datos_proyectos')) || [];
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

// Asegúrate de que esta función esté definida solo una vez en todo tu proyecto
function cargarVista(nombre) {
    // Solo oculta y muestra elementos que YA existen en tu HTML
    document.querySelectorAll('.vista').forEach(v => v.classList.add('hidden'));
    
    const vista = document.getElementById(`vista-${nombre}`);
    if (vista) {
        vista.classList.remove('hidden');
        console.log(`Vista ${nombre} cargada correctamente.`);
    } else {
        console.error(`Error: No existe el elemento con ID vista-${nombre}`);
    }
}


// ==========================================
// INICIALIZACIÓN UNIFICADA DE LA APP
// ==========================================
// 1. Asegúrate de que esta función sea global y robusta
// En main.js (o donde esté tu función)
function actualizarLabelUsuario() {
    const label = document.getElementById('user-label');
    const usuario = localStorage.getItem('app_currentUser');
    
    if (label) {
        label.innerText = usuario ? usuario : "Invitado";
    }
}


/// En js/main.js
// js/main.js
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Ocultar todo lo que no deba verse al principio
    const modalIdentidad = document.getElementById('modal-identidad');
    modalIdentidad.style.display = 'flex'; // Solo lo mostramos nosotros manualmente

    // 2. Cargamos datos
    await cargarDatosGlobales();
    
    // 3. Verificamos sesión
 // Dentro de tu lógica de carga inicial:
const usuario = localStorage.getItem('app_currentUser');
const modalLogin = document.getElementById('modal-identidad');

if (usuario) {
    currentUser = usuario;
    actualizarLabelUsuario();
    
    // FORZAR LA OCULTACIÓN DEL MODAL
    if (modalLogin) {
        modalLogin.classList.add('hidden'); // Esto elimina el login de la vista
    }
    
    cargarVista('inicio');
} else {
    // Si no hay usuario, mostrar el login
    if (modalLogin) {
        modalLogin.classList.remove('hidden');
    }
}});

// Listener de navegación
// En js/main.js

