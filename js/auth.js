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
    const usuarioIngresado = document.getElementById('input-usuario-login').value.trim();
    const passwordIngresado = document.getElementById('input-password-inicial').value.trim();

    const lista = window.obtenerListaFamiliares();

    const usuarioEncontrado = lista.find(f => {
        const nombreSheet = f.nombre ? String(f.nombre).trim().toLowerCase() : "";
        const passwordSheet = f.password ? String(f.password).trim() : "";

        return nombreSheet === usuarioIngresado.toLowerCase() &&
               passwordSheet === passwordIngresado;
    });

    if (usuarioEncontrado) {
        // 1. Guardamos sesión
        localStorage.setItem('app_currentUser', usuarioEncontrado.nombre);
        
        // 2. Ocultamos el modal
        const modal = document.getElementById('modal-identidad');
        modal.classList.add('hidden');
        modal.style.display = 'none';

        // 3. Actualizamos la etiqueta del usuario
        const label = document.getElementById('user-label');
        if (label) label.textContent = usuarioEncontrado.nombre;

        // 4. USAMOS LA FUNCIÓN CORRECTA (navegarA en lugar de cargarVista)
        // Ya no necesitamos el "asegurarCargaVista" porque navegarA 
        // ya incluye la lógica de fetch y carga.
        await navegarA('inicio');
        
        console.log("Sesión iniciada y vista cargada correctamente.");
    } else {
        alert("Usuario o contraseña incorrectos.");
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
    // 1. Limpiamos los datos del usuario
    localStorage.removeItem('app_currentUser');
    // Opcional: localStorage.removeItem('app_familiares'); 
    
    // 2. Ocultamos TODAS las vistas
    document.querySelectorAll('.vista').forEach(v => {
        v.classList.add('hidden');
        v.style.display = 'none';
    });

    // 3. Mostramos el modal de login
    const modal = document.getElementById('modal-identidad');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }

    console.log("Sesión cerrada correctamente.");
}

