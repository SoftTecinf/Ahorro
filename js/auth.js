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

async function confirmarIdentidad() {
    // 1. Aseguramos que tenemos datos cargados
    if (!window.familiares || window.familiares.length === 0) {
        console.log("Datos vacíos, intentando recargar desde fuente...");
        await cargarDatosGlobales(); // Esta función debe ser la que trae los datos del Sheet
    }

    const usuarioIngresado = document.getElementById('input-usuario-login').value.trim();
    const passwordIngresado = document.getElementById('input-password-inicial').value.trim();

    // 2. Ahora sí, buscamos en la lista actualizada
    const usuarioEncontrado = window.familiares.find(f => {
        const nombreSheet = f.nombre ? String(f.nombre).trim().toLowerCase() : "";
        const passwordSheet = f.password ? String(f.password).trim() : "";

        return nombreSheet === usuarioIngresado.toLowerCase() &&
            passwordSheet === passwordIngresado;
    });

    // Asegúrate de que esto sea lo único que hace el botón
    if (usuarioEncontrado) {
        localStorage.setItem('app_currentUser', usuarioEncontrado.nombre);
        
        // ¡IMPORTANTE! Limpiar la UI inmediatamente
        document.getElementById('modal-identidad').classList.remove('visible');
        document.getElementById('user-label').textContent = usuarioEncontrado.nombre;
        
        // No esperes al F5, navega ahora mismo
        await navegarA('inicio'); 
    } else {
        alert("Usuario no encontrado o contraseña incorrecta.");
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

function cerrarSesion() {
    // 1. Limpieza lógica (Instantáneo)
    localStorage.removeItem('app_currentUser');
    
    // 2. Limpieza de memoria (para que no queden datos viejos)
    window.familiares = null; 
    
    // 3. Efecto visual instantáneo
    const modal = document.getElementById('modal-identidad');
    modal.classList.add('visible'); // Mostramos el login sin recargar
    
    // 4. Ocultamos las vistas activas (para que no queden restos)
    const vistas = document.querySelectorAll('.vista'); 
    vistas.forEach(v => v.classList.add('hidden')); // Ajusta según tu clase de ocultar
    
    console.log("Sesión cerrada instantáneamente");
    
    // ¡NO USES location.reload()! 
    // Si la app no muestra el login correctamente, 
    // es un problema de estilos, no de recarga.
}