window.familiares = JSON.parse(localStorage.getItem('app_familiares')) || [];
//        const respuesta = await fetch('https://script.google.com/macros/s/AKfycbxTFZLLfvP8cywVA8IzMsVa0BPA9OeLieUV-6Cgg_XNxLZLH6Uxzx_QpfdOzMH3x2wdVQ/exec');


async function confirmarIdentidad() {
    // 1. Si no hay datos, forzamos la carga antes de buscar
    if (!window.familiares || window.familiares.length === 0) {
        console.log("Datos no encontrados, cargando...");
        await cargarDatosGlobales(); // Esperamos a que la petición termine
    }

    // 2. Ahora sí, procedemos con la validación
    const usuarioIngresado = document.getElementById('input-usuario-login').value.trim();
    const passwordIngresado = document.getElementById('input-password-inicial').value.trim();

    const usuarioEncontrado = window.familiares.find(f => {
        const nombreSheet = f.nombre ? String(f.nombre).trim().toLowerCase() : "";
        const passwordSheet = f.password ? String(f.password).trim() : "";
        return nombreSheet === usuarioIngresado.toLowerCase() && passwordSheet === passwordIngresado;
    });

    if (usuarioEncontrado) {
        localStorage.setItem('app_currentUser', usuarioEncontrado.nombre);
        document.getElementById('modal-identidad').classList.add('hidden');
        document.getElementById('user-label').textContent = usuarioEncontrado.nombre;
        await navegarA('inicio');
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}

// En js/api.js
window.obtenerListaFamiliares = function() {
    return window.familiares && window.familiares.length > 0 
        ? window.familiares 
        : (JSON.parse(localStorage.getItem('app_familiares')) || []);
};