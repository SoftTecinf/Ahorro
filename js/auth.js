// ==========================================
// LÓGICA DE CONTROL DEL LOGIN / REGISTRO
// ==========================================


// En tu función confirmarIdentidad (dentro del if(usuarioEncontrado))
// ...
actualizarLabelUsuario();
cargarVista('inicio');

// En lugar de solo: document.getElementById('modal-identidad').classList.add('hidden');
// Usa esto:
const modal = document.getElementById('modal-identidad');
if (modal) {
    modal.classList.add('hidden');
} else {
    console.warn("El modal aún no existe en el DOM");
}

function togglePassword(idInput) {
    const input = document.getElementById(idInput);
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
}

async function confirmarIdentidad() {
    const usuarioIngresado = document.getElementById('input-usuario-login').value.trim();
    const passwordIngresado = document.getElementById('input-password-inicial').value.trim();

    // 1. Intentamos obtener los datos de donde estén: la variable global o el localStorage
    // 1. Obtenemos la lista una sola vez
    const lista = window.familiares && window.familiares.length > 0
        ? window.familiares
        : (JSON.parse(localStorage.getItem('app_familiares')) || []);

    // 2. Buscamos al usuario de forma segura
    const usuarioEncontrado = lista.find(f =>
        String(f.nombre).trim().toLowerCase() === usuarioIngresado.toLowerCase() &&
        String(f.pin) === String(passwordIngresado)
    );
    if (usuarioEncontrado) {
        // Guardamos la sesión
        localStorage.setItem('app_currentUser', usuarioEncontrado.nombre);

        // ... dentro del if(usuarioEncontrado)
        const userLabel = document.getElementById('user-label');
        if (userLabel) {
            userLabel.textContent = usuarioEncontrado.nombre;
        } else {
            console.warn("No se encontró el modal-identidad, pero la sesión ya inició.");
        }

        // ¡Cargamos la vista! (Asegúrate de tener esta función en main.js)
        if (typeof cargarVista === 'function') {
            cargarVista('inicio');
        }
        console.log("¡Éxito! Usuario autenticado.");
    } else {
        alert("Usuario o contraseña incorrectos. Verifica tus datos.");
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
    // 3. Registro en Sheety (API)
    try {
        const URL_USUARIOS = 'https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/usuarios';

        const nuevoFamiliar = {
            usuario: {
                nombre: nombre,
                pin: password,
                celular: celular
            }
        };

        // --------------------------------------------------

        // 4. Guardar localmente solo SI el servidor respondió bien
        lista.push({
            nombre: nombre,
            celular: celular,
            pin: password
        });

        window.familiares = lista;
        localStorage.setItem('app_familiares', JSON.stringify(lista));

        // ... resto de tu código de éxito
        alert(`¡Bienvenido(a), ${nombre}! ✨`);
        document.getElementById('modal-identidad').classList.add('hidden');

    } catch (err) {
        console.error(err);
        alert("Error al conectar con la base de datos. Inténtalo más tarde.");
    }
}

function cerrarSesion() {
    if (confirm("¿Estás seguro de que deseas cerrar la sesión del perfil actual?")) {
        localStorage.removeItem('app_currentUser');
        location.reload();
    }
}
