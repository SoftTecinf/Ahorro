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

// Asegúrate de que esta función esté definida solo una vez en todo tu proyecto
function cargarVista(nombre) {
    // 1. Ocultar vistas
    document.querySelectorAll('.vista').forEach(v => v.classList.add('hidden'));
    document.getElementById(`vista-${nombre}`).classList.remove('hidden');

    // 2. Cambiar estilos de los botones (opcional pero recomendado)
    document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-blue-500', 'text-white');
        btn.classList.add('text-gray-500');
    });

    const botonActivo = document.getElementById(`btn-${nombre === 'config' ? 'configuracion' : nombre}`);
    if (botonActivo) {
        botonActivo.classList.add('bg-gradient-to-r', 'from-purple-600', 'to-blue-500', 'text-white');
        botonActivo.classList.remove('text-gray-500');
    }
} 


// ==========================================
// INICIALIZACIÓN UNIFICADA DE LA APP
// ==========================================
// 1. Asegúrate de que esta función sea global y robusta
function actualizarLabelUsuario() {
    const label = document.getElementById('user-label');
    const usuarioActual = localStorage.getItem('app_currentUser');
    
    if (label && usuarioActual) {
        label.innerText = usuarioActual; // Actualiza con el nombre real
        label.classList.remove('bg-purple-50', 'text-purple-600');
        label.classList.add('bg-green-100', 'text-green-700'); // Cambia a verde para indicar éxito
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

