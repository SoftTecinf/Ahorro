// ==========================================
// LÓGICA DE CONTROL DEL LOGIN / REGISTRO
// ==========================================
function cambiarVista(tipo) {
    const vLogin = document.getElementById('vista-login');
    const vRegistro = document.getElementById('vista-registro');
    const tLogin = document.getElementById('tab-login');
    const tRegistration = document.getElementById('tab-registro');

    if (tipo === 'login') {
        if (vLogin) vLogin.classList.remove('hidden');
        if (vRegistro) vRegistro.classList.add('hidden');
        if (tLogin) tLogin.className = "flex-1 pb-2 text-center text-purple-600 border-b-2 border-purple-600 cursor-pointer";
        if (tRegistration) tRegistration.className = "flex-1 pb-2 text-center text-gray-400 border-b-2 border-transparent cursor-pointer";
    } else {
        if (vLogin) vLogin.classList.add('hidden');
        if (vRegistro) vRegistro.classList.remove('hidden');
        if (tLogin) tLogin.className = "flex-1 pb-2 text-center text-gray-400 border-b-2 border-transparent cursor-pointer";
        if (tRegistration) tRegistration.className = "flex-1 pb-2 text-center text-purple-600 border-b-2 border-purple-600 cursor-pointer";
    }
}

function togglePassword(idInput) {
    const input = document.getElementById(idInput);
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
}

async function confirmarIdentidad() {
    const usuario = document.getElementById('input-usuario-login').value;
    // ... lógica para validar usuario ...

    if (validado) {
        localStorage.setItem('app_currentUser', usuario);
        currentUser = usuario;
        
        // --- AQUÍ ESTÁ LA CLAVE ---
        // 1. Esconder el modal de identidad
        const modal = document.getElementById('modal-identidad');
        modal.classList.add('hidden');
        
        // 2. Actualizar la etiqueta del usuario
        actualizarLabelUsuario();
        
        // 3. ¡Forzar la carga de la vista inicio!
        cargarVista('inicio');
        
        console.log("Inicio de sesión exitoso, vista cargada.");
    }
}

async function procesarRegistro() {
    // 1. Protección contra el error de "undefined"
    if (typeof familiares === 'undefined') {
        window.familiares = JSON.parse(localStorage.getItem('app_familiares')) || [];
    }
    const lista = window.familiares || [];

    const nombre = document.getElementById('reg-nombre').value.trim();
    const celularInput = document.getElementById('reg-celular');
    const password = document.getElementById('reg-pass').value;

    if (!celularInput) return;
    const celular = celularInput.value.trim();
    const regexCelular = /^[0-9]{10}$/;

    if (!nombre || password.length < 4) {
        return alert("Rellena todos los campos. La contraseña debe tener al menos 4 caracteres.");
    }

    if (!regexCelular.test(celular)) {
        alert("❌ El número de celular debe contener exactamente 10 dígitos numéricos.");
        return;
    }

    // 2. Validación usando la lista segura
    if (lista.some(f => f.nombre.toLowerCase() === nombre.toLowerCase())) {
        return alert("Este nombre ya se encuentra registrado.");
    }

    // 3. Registro en Sheety (API)
    try {
        const URL_USUARIOS = 'https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/usuarios';
        // Asegúrate de que el objeto interno coincida con tus columnas:
        const nuevoFamiliar = {
            usuario: {
                nombre: nombre,  // Debe ser igual a tu columna 'nombre'
                pin: password,   // Debe ser igual a tu columna 'pin'
                celular: celular // Debe ser igual a tu columna 'celular'
            }
        };

        const res = await fetch(URL_USUARIOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoFamiliar)
        });

        if (!res.ok) throw new Error("Error en servidor");

        // 4. Guardar localmente solo si el servidor respondió bien
        lista.push({ nombre, celular, password });
        window.familiares = lista;
        localStorage.setItem('app_familiares', JSON.stringify(lista));

        // ... (resto de tu lógica de éxito)
        alert(`¡Bienvenido(a), ${nombre}! ✨`);
        document.getElementById('modal-identidad').classList.add('hidden');

    } catch (err) {
        console.error(err);
        alert("Error al conectar con la base de datos.");
    }
}

function cerrarSesion() {
    if (confirm("¿Estás seguro de que deseas cerrar la sesión del perfil actual?")) {
        localStorage.removeItem('app_currentUser');
        location.reload();
    }
}
