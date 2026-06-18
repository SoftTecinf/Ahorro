// ==========================================
// LÓGICA DE CONTROL DEL LOGIN / REGISTRO
// ==========================================



function togglePassword(idInput) {
    const input = document.getElementById(idInput);
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
}

function ocultarModalIdentidad() {
    const modal = document.getElementById('modal-identidad');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none'; // Refuerzo para asegurar el cierre
    }
}


async function procesarRegistro() {
    const lista = window.obtenerListaFamiliares(); 
    const nombre = document.getElementById('reg-nombre').value.trim();
    const celular = document.getElementById('reg-celular').value.trim();
    const password = document.getElementById('reg-pass').value;

    if (!nombre || password.length < 4 || !/^[0-9]{10}$/.test(celular)) {
        return alert("Verifica los datos: nombre, celular de 10 dígitos y contraseña de al menos 4 caracteres.");
    }

    if (lista.some(f => f.nombre.toLowerCase() === nombre.toLowerCase())) {
        return alert("Este nombre ya existe.");
    }

    try {
        const URL_API = 'https://script.google.com/macros/s/AKfycbxTFZLLfvP8cywVA8IzMsVa0BPA9OeLieUV-6Cgg_XNxLZLH6Uxzx_QpfdOzMH3x2wdVQ/exec';

        console.log("Enviando datos de registro...");

        // Quitamos 'mode: 'no-cors'' para poder procesar la respuesta JSON correctamente
        const respuesta = await fetch(URL_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, celular, password })
        });

        // Ahora sí podemos leer el resultado real del servidor de Google
        const resultado = await respuesta.json();
        console.log("Datos enviados y procesados con éxito:", resultado);
        
        alert("¡Registro guardado exitosamente!");
        
    } catch (err) {
        console.error("Error en la petición de registro:", err);
        alert("Error al conectar con la base de datos. Revisa la consola.");
    }
}

async function confirmarIdentidad() {
    // 1. Intentamos leer la lista de la memoria
    let listaFamiliares = window.familiares || familiares;

    // 2. PROTECCIÓN ULTRA-RÁPIDA: Si la lista está vacía, es muy probable que la carga 
    // inicial de fondo siga viajando por internet. Le damos una micro-espera de respaldo.
    if (!listaFamiliares || listaFamiliares.length === 0) {
        console.log("⏳ Los datos aún están viajando de internet. Esperando un segundo...");
        // Pausamos la ejecución por 1 segundo para permitir que el internet termine de responder
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Volvemos a checar la lista actualizada
        listaFamiliares = window.familiares || familiares;
    }

    // 3. Si tras la espera de cortesía sigue vacía, forzamos una recarga manual directa
    if (!listaFamiliares || listaFamiliares.length === 0) {
        console.log("🔄 La carga inicial tardó demasiado. Forzando descarga directa...");
        await cargarDatosGlobales();
        listaFamiliares = window.familiares || familiares;
    }

    // 4. Alerta de pánico (Por si de verdad no hay internet o el servidor se cayó)
    if (!listaFamiliares || listaFamiliares.length === 0) {
        alert("No se pudieron conectar los datos del sistema. Revisa tu conexión a internet.");
        return;
    }

    // [El resto de tu lógica de validación se queda exactamente igual]
    const usuarioIngresado = document.getElementById('input-usuario-login').value.trim();
    const passwordIngresado = document.getElementById('input-password-inicial').value.trim();

    const usuarioEncontrado = listaFamiliares.find(f => {
        const nombreSheet = f.nombre ? String(f.nombre).trim().toLowerCase() : "";
        const passwordSheet = f.password ? String(f.password).trim() : "";
        return nombreSheet === usuarioIngresado.toLowerCase() && passwordSheet === passwordIngresado;
    });

    if (usuarioEncontrado) {
        localStorage.setItem('app_currentUser', usuarioEncontrado.nombre);
        
        const modalLogin = document.getElementById('modal-identidad');
        const appContainer = document.getElementById('app-container');
        const userLabel = document.getElementById('user-label');
        
        if (modalLogin) modalLogin.classList.remove('visible');
        if (appContainer) appContainer.style.display = 'block';
        if (userLabel) userLabel.textContent = usuarioEncontrado.nombre;
        
        await navegarA('inicio'); 
    } else {
        alert("Usuario no encontrado o contraseña incorrecta.");
    }
}

function cerrarSesion() {
    console.log("Iniciando proceso de cierre de sesión...");
    
    // 1. Limpieza de datos
    localStorage.removeItem('app_currentUser');
    if (window.familiares) window.familiares = null;
    
    // 2. Captura de elementos
    const modalLogin = document.getElementById('modal-identidad');
    const appContainer = document.getElementById('app-container');
    const userLabel = document.getElementById('user-label');

    // 3. IDIOMA UNIFICADO: Mostramos login, ocultamos app de inmediato
    if (modalLogin) modalLogin.style.display = 'flex';
    if (appContainer) appContainer.style.display = 'none';
    if (userLabel) userLabel.textContent = "";

    console.log("Sesión destruida visualmente. Reiniciando memoria...");
    
    // 4. Limpieza total de memoria volátil
    location.reload(); 
}