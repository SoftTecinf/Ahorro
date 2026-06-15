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
        localStorage.setItem('app_currentUser', usuarioEncontrado.nombre);
        document.getElementById('modal-identidad').classList.add('hidden');

        // BLINDAJE: Si cargarVista aún no existe, esperamos 100ms y reintentamos
        const asegurarCargaVista = (intento = 0) => {
            if (typeof window.cargarVista === 'function') {
                window.cargarVista('inicio');
            } else if (intento < 10) { // Reintentar hasta 10 veces
                console.warn("Esperando a cargarVista...");
                setTimeout(() => asegurarCargaVista(intento + 1), 100);
            } else {
                console.error("Error crítico: cargarVista nunca se definió.");
            }
        };

        asegurarCargaVista();
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
    } catch (err) {
        console.error(err);
        alert("Error al conectar con la base de datos.");
    }
}

function cerrarSesion() {
    if (confirm("¿Cerrar sesión?")) {
        localStorage.removeItem('app_currentUser');
        location.reload();
    }
}

