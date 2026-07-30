

// ==========================================
// VARIABLES GLOBALES
// ==========================================
let familiares = JSON.parse(localStorage.getItem('app_familiares')) || [];
let proyectos = JSON.parse(localStorage.getItem('app_proyectos')) || [];
window.proyectos = proyectos;
let cuentasBancarias = [];
let invitacionesPendientes = [];
let currentUser = localStorage.getItem('app_currentUser') || '';

// ==========================================
// LÓGICA DE CONTROL DE VISTAS (Global)
// ==========================================

function actualizarLabelUsuario() {
    const label = document.getElementById('user-label');
    if (label) {
        label.textContent = currentUser ? `👤 ${currentUser}` : "No identificado";
    }
}
// ==========================================
// INICIALIZACIÓN UNIFICADA
// ==========================================
window.appReady = false;


window.addEventListener('DOMContentLoaded', async () => {
    const appContainer = document.getElementById('app-container');
    const modalLogin = document.getElementById('modal-identidad');

    const usuarioGuardado = localStorage.getItem('app_currentUser');
    const lista = window.obtenerListaFamiliares ? window.obtenerListaFamiliares() : [];
    const esValido = usuarioGuardado && lista.some(f => f.nombre === usuarioGuardado);

    if (esValido) {
        if (modalLogin) modalLogin.style.display = 'none';

        const label = document.getElementById('user-label');
        if (label) label.textContent = usuarioGuardado;

        // --- CARGA INMEDIATA DESDE CACHÉ (BLINDADA) ---
        const cacheProyectos = localStorage.getItem('app_cache_proyectos');
        if (cacheProyectos) {
            try {
                window.proyectos = JSON.parse(cacheProyectos) || [];
            } catch (e) {
                console.error("Error al leer caché:", e);
                window.proyectos = [];
            }
        } else {
            window.proyectos = [];
        }

        // Navegamos al inicio
        await navegarA('inicio');

        // 🟢 PINTAMOS LA TABLA DE INMEDIATO CON LO QUE HAY EN MEMORIA
        if (typeof window.renderizarGridProyectos === 'function') {
            window.renderizarGridProyectos();
        }

        // --- CARGA FRESCA DESDE GOOGLE SHEETS EN SEGUNDO PLANO ---
        if (typeof window.cargarDatosGlobales === 'function') {
            window.cargarDatosGlobales().then(() => {
                if (typeof window.renderizarGridProyectos === 'function') {
                    window.renderizarGridProyectos();
                }
            });
        }

        // 🟢 ACTIVAR FORMATO DE MONEDA FLUIDO EN EL INPUT DE MONTO
        const inputMonto = document.getElementById('datos-monto');
        if (inputMonto && !inputMonto.dataset.formatoConfigurado) {
            inputMonto.dataset.formatoConfigurado = "true";

            // Mientras escribes, solo permitimos números y puntos
            inputMonto.addEventListener('input', function (e) {
                this.value = this.value.replace(/[^0-9.]/g, '');
            });

            // Cuando sales del campo, se aplica el formato bonito de moneda MXN
            inputMonto.addEventListener('blur', function (e) {
                let numericValue = parseFloat(this.value.replace(/[^0-9.]/g, '')) || 0;
                if (numericValue > 0) {
                    this.value = numericValue.toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }
            });

            // Al hacer clic para editar, quitamos el formato para que puedas modificarlo fácil
            inputMonto.addEventListener('focus', function (e) {
                let numericValue = parseFloat(this.value.replace(/[^0-9.]/g, '')) || '';
                this.value = numericValue ? numericValue : '';
            });
        }

    } else {
        if (modalLogin) {
            modalLogin.style.display = 'flex';
            modalLogin.classList.add('visible');
        }
        if (appContainer) {
            appContainer.style.display = 'none';
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

    const contenedor = document.getElementById(vistaId);
    if (!contenedor) return console.error("No existe el ID:", vistaId);

    // 2. Cargar contenido si está vacío
    if (contenedor.innerHTML.trim() === "") {
        try {
            const response = await fetch(`${vistaId}.html`);
            const html = await response.text();
            contenedor.innerHTML = html;
        } catch (error) {
            console.error("Error al cargar:", error);
            return;
        }
    }

    // 3. FORZADO DE VISIBILIDAD (Ya está aquí el HTML)
    contenedor.classList.remove('hidden');
    contenedor.style.display = 'block';

    // 4. AQUÍ LLAMAMOS AL RENDERIZADO (Ya existe el HTML y los IDs)
    if (vistaId === 'inicio' && typeof renderizarInicioProyectos === 'function') {
        renderizarInicioProyectos();
    } else if (vistaId === 'datos' && typeof window.renderizarGridProyectos === 'function') {
        window.renderizarGridProyectos();
    }

    // 5. Sincronizar botones (Tu lógica de UI)
    document.querySelectorAll('nav button').forEach(button => {
        button.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-blue-500', 'text-white', 'shadow-sm');
        button.classList.add('text-gray-500', 'hover:bg-purple-50/50');
    });

    const btnActivo = document.querySelector(`nav button[onclick*="${vistaId}"]`);
    if (btnActivo) {
        btnActivo.classList.add('bg-gradient-to-r', 'from-purple-600', 'to-blue-500', 'text-white', 'shadow-sm');
        btnActivo.classList.remove('text-gray-500', 'hover:bg-purple-50/50');
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
