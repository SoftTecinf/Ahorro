// VARIABLES GLOBALES (Ahora se llenarán desde la nube)
// ==========================================
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

async function cargarVista(nombreVista) {
    const contenedor = document.getElementById('contenedor-vistas');
    if (!contenedor) return;

    try {
        // 1. Intentar cargar el archivo HTML
        const respuesta = await fetch(`${nombreVista}.html`);
        if (!respuesta.ok) throw new Error(`Archivo ${nombreVista}.html no encontrado`);
        
        const html = await respuesta.text();
        contenedor.innerHTML = html;

        // 2. FORZAR VISIBILIDAD (Esto garantiza que el usuario vea el diseño)
        const elementosOcultos = contenedor.querySelectorAll('.hidden');
        elementosOcultos.forEach(el => el.classList.remove('hidden'));

        // 3. ESTILOS DE NAVEGACIÓN
        document.querySelectorAll('nav button').forEach(btn => 
            btn.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-blue-500', 'text-white')
        );
        const btnActivo = document.querySelector(`[data-vista="${nombreVista}"]`);
        if (btnActivo) btnActivo.classList.add('bg-gradient-to-r', 'from-purple-600', 'to-blue-500', 'text-white');

        // 4. EJECUTAR LÓGICA (Try-Catch independiente para que no rompa el diseño)
        try {
            actualizarLabelUsuario();
            if (nombreVista === 'inicio') await renderizarInicioProyectos();
            if (nombreVista === 'datos') await renderizarGridProyectos();
            if (nombreVista === 'config') await actualizarSelectoresConfig();
        } catch (logicError) {
            console.error("Error en la lógica:", logicError);
            // No hacemos nada aquí, el HTML ya se mostró
        }
        
    } catch (fetchError) {
        console.error("Error crítico:", fetchError);
        contenedor.innerHTML = `<p class="p-4 text-red-500">Error al cargar la vista: ${fetchError.message}</p>`;
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
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargamos datos de la nube
    await cargarDatosGlobales();
    
    // 2. Verificamos sesión con un poco más de robustez
    const usuarioGuardado = localStorage.getItem('app_currentUser');
    
    if (usuarioGuardado) {
        // Si existe el usuario, asignamos la variable y actualizamos la UI
        currentUser = usuarioGuardado;
        actualizarLabelUsuario();
        await cargarVista('inicio'); 
    } else {
        // Solo si NO existe el usuario en localStorage, vamos al login
        await cargarVista('login');
    }
});


// Listener de navegación
// En js/main.js

