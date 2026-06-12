// ==========================================
// LÓGICA DE CONTROL DEL LOGIN / REGISTRO
// ==========================================


// En tu función confirmarIdentidad (dentro del if(usuarioEncontrado))
// ...
actualizarLabelUsuario();
cargarVista('inicio');

// AÑADE ESTO:
const modal = document.getElementById('modal-identidad');
modal.classList.add('hidden'); // Oculta el modal
modal.style.display = 'none'; // Fuerza el cierre por si la clase CSS falla
console.log("Sesión iniciada y modal oculto.");

function togglePassword(idInput) {
    const input = document.getElementById(idInput);
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
}

async function confirmarIdentidad() {
    const usuarioIngresado = document.getElementById('input-usuario-login').value.trim();
    const passwordIngresado = document.getElementById('input-password-inicial').value.trim();

    const lista = window.familiares || [];

    // Aquí está el cambio clave: usamos 'f.pin'
    const usuarioEncontrado = lista.find(f =>
        f.nombre.trim().toLowerCase() === usuarioIngresado.toLowerCase() &&
        String(f.pin) === String(passwordIngresado)
    );

    if (usuarioEncontrado) {
        localStorage.setItem('app_currentUser', usuarioEncontrado.nombre);
        document.getElementById('modal-identidad').classList.add('hidden'); // Oculta el login
        actualizarLabelUsuario();
        cargarVista('inicio'); // Llama a la función única en main.js
    } else {
        console.log("Intento fallido:", usuarioIngresado, passwordIngresado);
        alert("Usuario o contraseña incorrectos. Verifica que el PIN sea correcto.");
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
