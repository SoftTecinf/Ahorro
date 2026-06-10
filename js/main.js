// ==========================================
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
// NUEVA NAVEGACIÓN DINÁMICA (Sustituye a navegarA)
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
function inicializarApp() {
    if (familiares.length > 0 && typeof familiares[0] === 'string') {
        familiares = familiares.map(fName => ({ nombre: fName, celular: "", password: "123" }));
        localStorage.setItem('app_familiares', JSON.stringify(familiares));
    }

    actualizarLabelUsuario();

    const urlParams = new URLSearchParams(window.location.search);
    const idProyectoInvitacion = urlParams.get('proyecto');
    if (idProyectoInvitacion) {
        sessionStorage.setItem('pending_proyecto', idProyectoInvitacion);
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const modalIdentidad = document.getElementById('modal-identidad');

    if (currentUser) {
        if (modalIdentidad) modalIdentidad.classList.add('hidden');
        procesarInvitacionPendiente();
        navegarA('sec-inicio');
    } else {
        if (modalIdentidad) modalIdentidad.classList.remove('hidden');
        cambiarVista('login');
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    await cargarDatosGlobales(); // Cargamos todo al arrancar
    cargarVista('inicio');       // Cargamos la primera vista
});


// Listener de navegación
document.addEventListener('click', (e) => {
    const boton = e.target.closest('[data-vista]');
    if (boton) {
        cargarVista(boton.dataset.vista);
    }
});
