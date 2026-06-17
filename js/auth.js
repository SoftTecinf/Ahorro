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
    const lista = window.obtenerListaFamiliares(); // Llama a la función central
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
        // Dentro de tu función procesarRegistro en auth.js:
        const URL_API = 'https://script.google.com/macros/s/AKfycbxTFZLLfvP8cywVA8IzMsVa0BPA9OeLieUV-6Cgg_XNxLZLH6Uxzx_QpfdOzMH3x2wdVQ/exec';

        // En el fetch de envío:
        const respuesta = await fetch(URL_API, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, celular, password })
        });
        const resultado = await respuesta.json();
        console.log("Datos enviados:", resultado);
    } catch (err) {
        console.error(err);
        alert("Error al conectar con la base de datos.");
    }
}

async function confirmarIdentidad() {
    // 1. Aseguramos que tenemos datos cargados (Usamos fallback por si window no está mapeado)
    const listaFamiliares = window.familiares || familiares;
    if (!listaFamiliares || listaFamiliares.length === 0) {
        console.log("Datos vacíos, intentando recargar desde fuente...");
        await cargarDatosGlobales();
    }

    const usuarioIngresado = document.getElementById('input-usuario-login').value.trim();
    const passwordIngresado = document.getElementById('input-password-inicial').value.trim();

    // 2. Buscamos en la lista
    const usuarioEncontrado = listaFamiliares.find(f => {
        const nombreSheet = f.nombre ? String(f.nombre).trim().toLowerCase() : "";
        const passwordSheet = f.password ? String(f.password).trim() : "";
        return nombreSheet === usuarioIngresado.toLowerCase() && passwordSheet === passwordIngresado;
    });

    if (usuarioEncontrado) {
        localStorage.setItem('app_currentUser', usuarioEncontrado.nombre);
        
        // 3. CAPTURAMOS ELEMENTOS
        const modalLogin = document.getElementById('modal-identidad');
        const appContainer = document.getElementById('app-container');
        const userLabel = document.getElementById('user-label');
        
        // 4. IDIOMA UNIFICADO: Apagamos login, prendemos app con style.display
        if (modalLogin) modalLogin.style.display = 'none';
        if (appContainer) appContainer.style.display = 'block';
        if (userLabel) userLabel.textContent = usuarioEncontrado.nombre;
        
        // Redirigimos al inicio de la app
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