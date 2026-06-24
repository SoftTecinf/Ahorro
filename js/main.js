

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

        // 3. Si encontramos modalLogin, lo ocultamos
        if (modalLogin) {
            modalLogin.style.display = 'none';
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

    // 1. Ocultar todas las vistas
    document.querySelectorAll('.vista').forEach(v => {
        v.classList.add('hidden');
        v.style.display = 'none';
    });

    // 2. Localizar el contenedor
    const contenedor = document.getElementById(vistaId);

    if (contenedor) {
        // 3. Cargar contenido SIEMPRE que esté vacío
        if (contenedor.innerHTML.trim() === "") {
            try {
                const response = await fetch(`${vistaId}.html`);
                const html = await response.text();
                contenedor.innerHTML = html;

                // --- AQUÍ ESTÁ LA CLAVE ---
                // Esperamos un tiempo mínimo (50ms) para que el navegador cree los elementos
                await new Promise(resolve => setTimeout(resolve, 50));

            } catch (error) {
                console.error("Error al cargar:", error);
                contenedor.innerHTML = "<p class='p-4 text-red-500'>Error al cargar contenido.</p>";
            }
        }

        // ... dentro de navegarA, después de cargar el HTML:
        contenedor.innerHTML = html;

        // AGREGA ESTO AQUÍ:
        window.inicializarEventos();

        await new Promise(resolve => setTimeout(resolve, 50));

        // 4. FORZADO DE VISIBILIDAD (Aquí está la clave)
        contenedor.classList.remove('hidden');
        contenedor.style.display = 'block';
        contenedor.style.visibility = 'visible'; // Asegura que no esté invisible
        contenedor.style.opacity = '1';          // Asegura que no sea transparente

        // Ahora llamamos al renderizado
        if (typeof window.renderizarGridProyectos === 'function') {
            window.renderizarGridProyectos();
        }

        // En lugar de un setInterval que siempre lanza error, usa una lógica más limpia:
        const grid = document.getElementById('grid-proyectos');

        if (grid) {
            // Si el elemento existe, renderizamos
            if (typeof window.renderizarGridProyectos === 'function') {
                window.renderizarGridProyectos();
            }
        } else {
            // Si no existe, NO lanzamos un error, simplemente salimos.
            // Esto es normal si estamos en Inicio o Configuración.
            console.log("Estamos en una página sin tabla de proyectos, omitiendo renderizado.");
        }

        // 5. Sincronizar botones
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-blue-500', 'text-white', 'shadow-sm');
            btn.classList.add('text-gray-500', 'hover:bg-purple-50/50');
        });

        const btnActivo = document.querySelector(`nav button[onclick*="${vistaId}"]`);
        if (btnActivo) {
            btnActivo.classList.add('bg-gradient-to-r', 'from-purple-600', 'to-blue-500', 'text-white', 'shadow-sm');
            btnActivo.classList.remove('text-gray-500', 'hover:bg-purple-50/50');
        }
    } else {
        console.error("ERROR CRÍTICO: No existe el div con ID:", vistaId);
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
        const lista = window.obtenerListaFamiliares();
        const existeUsuario = lista.some(f => f.nombre === usuarioGuardado);

        if (existeUsuario) {
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


// Función para inicializar los eventos específicos de la página
window.inicializarEventos = function () {
    const inputMonto = document.getElementById('datos-monto');

    // Solo si existe el input en la página actual, le añadimos el evento
    if (inputMonto) {
        inputMonto.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, "");
            if (valor !== "") {
                let numero = parseInt(valor);
                e.target.value = new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                    maximumFractionDigits: 0
                }).format(numero);
            } else {
                e.target.value = "";
            }
        });
    }
};
