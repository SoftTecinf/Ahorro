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

    // Obtención segura de datos
    const lista = window.familiares && window.familiares.length > 0
        ? window.familiares
        : (JSON.parse(localStorage.getItem('app_familiares')) || []);

    // Búsqueda
    const usuarioEncontrado = lista.find(f =>
        String(f.nombre).trim().toLowerCase() === usuarioIngresado.toLowerCase() &&
        String(f.pin) === String(passwordIngresado)
    );

    if (usuarioEncontrado) {
        // Sesión
        localStorage.setItem('app_currentUser', usuarioEncontrado.nombre);
        
        // Actualizar UI
        const userLabel = document.getElementById('user-label');
        if (userLabel) userLabel.textContent = usuarioEncontrado.nombre;

        ocultarModalIdentidad();
        
        if (typeof cargarVista === 'function') {
            cargarVista('inicio');
        }
        console.log("¡Éxito! Usuario autenticado.");
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}

async function procesarRegistro() {
    const lista = window.familiares || JSON.parse(localStorage.getItem('app_familiares')) || [];
    
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
        const URL_USUARIOS = 'https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/usuarios';
        
        // Ejecutar POST a Sheety
        const response = await fetch(URL_USUARIOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: { nombre, pin: password, celular } })
        });

        if (!response.ok) throw new Error("Error en el servidor");

        // Guardar local
        lista.push({ nombre, celular, pin: password });
        window.familiares = lista;
        localStorage.setItem('app_familiares', JSON.stringify(lista));

        alert(`¡Bienvenido(a), ${nombre}! ✨`);
        ocultarModalIdentidad();
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