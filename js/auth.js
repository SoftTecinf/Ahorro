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

    // 1. Sistema de ráfagas: Espera un momento si la descarga de internet sigue en curso
    let intentos = 0;
    while ((!window.familiares || window.familiares.length === 0) && intentos < 15) {
        await new Promise(resolve => setTimeout(resolve, 200));
        intentos++;
    }

    // 2. Extraemos la lista final
    const listaFamiliares = window.obtenerListaFamiliares();

    if (!listaFamiliares || listaFamiliares.length === 0) {
        alert("El sistema aún no tiene datos cargados. Revisa tu conexión a internet o vuelve a intentarlo en 3 segundos.");
        return;
    }

    // 3. Captura de credenciales ingresadas por el usuario
    const usuarioIngresado = document.getElementById('input-usuario-login').value.trim();
    const passwordIngresado = document.getElementById('input-password-inicial').value.trim();
    
    // 4. Búsqueda exhaustiva
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

window.cerrarSesion = function() {
    console.log("🔒 Cerrando sesión...");
    
    // 1. Limpieza de datos en el dispositivo
    localStorage.removeItem('app_currentUser');
    window.familiares = []; // Es mejor dejarlo vacío que null
    
    // 2. FORZAMOS EL CIERRE INMEDIATO
    // Al recargar, la página vuelve a su estado original (HTML) 
    // y el 'main.js' vuelve a ejecutar su lógica de validación. 
    // Es el camino más corto y seguro.
    location.reload(); 
};