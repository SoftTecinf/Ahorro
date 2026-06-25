// 1. Inicializamos la variable global con lo que haya en caché
// Inicializamos la variable global con la misma clave de caché que guardamos abajo
window.familiares = JSON.parse(localStorage.getItem('app_cache_familiares')) || [];

// 2. Definimos la función de actualización masiva
window.cargarDatosGlobales = async function () {
    const url = "https://script.google.com/macros/s/AKfycbyl9NenydiCUF-XLNXWYnRX_xSRXJ3S00djvjgjUyIT2cBrHJeqbeJ0c5VPGFhvob5eLg/exec";

    const respuesta = await fetch(url);
    const data = await respuesta.json(); // Ahora 'data' contiene {familiares, proyectos, cuentas}

    // 1. Procesar Familiares
    window.familiares = (data.familiares || []).map(usuario => ({
        nombre: usuario.nombre ? String(usuario.nombre).trim() : "",
        password: usuario.password ? String(usuario.password).trim() : "",
        celular: usuario.celular ? String(usuario.celular).trim() : ""
    }));


    // 2. Procesar Proyectos (Copia todo y corrige solo lo necesario)
    window.proyectos = (data.proyectos || []).map(p => {
        // Convertimos las claves a minúsculas para normalizar
        // Esto hace que 'Monto', 'monto' o 'MONTO' funcionen igual
        const norm = Object.keys(p).reduce((acc, key) => {
            acc[key.toLowerCase()] = p[key];
            return acc;
        }, {});

        return {
            ...norm, // <-- Esto trae TODAS tus columnas de Sheets automáticamente
            id: norm.id || "",
            nombre: norm.nombre || "",
            // Convertimos a números de forma segura
            monto: parseFloat(norm.monto) || 0,
            plazos: parseInt(norm.plazos) || 0,
            cuota: parseFloat(norm.cuota) || 0, // ¡Ahora esto sí existirá!
            // Procesamos los datos complejos
            participantes: typeof norm.participantes === 'string' ? JSON.parse(norm.participantes || '[]') : (norm.participantes || []),
            historialDepositos: typeof norm.historialdepositos === 'string' ? JSON.parse(norm.historialdepositos || '{}') : (norm.historialdepositos || {})
        };
    });

    // 3. Procesar Cuentas
    window.cuentas = (data.cuentas || []).map(c => ({
        id: c.id || "",
        banco: c.banco || "",
        titular: c.titular || "",
        clabe: c.clabe || ""
    }));

    // Guardamos en caché
    localStorage.setItem('app_cache_familiares', JSON.stringify(window.familiares));
    localStorage.setItem('app_cache_proyectos', JSON.stringify(window.proyectos));
    localStorage.setItem('app_cache_cuentas', JSON.stringify(window.cuentas));

    // AQUÍ ES LA CLAVE: Llama al renderizado solo cuando los datos ya existen
    renderizarInicioProyectos();
};


// 🔥 ¡ESTA LÍNEA ES CLAVE! Ejecuta la función en segundo plano nada más abrir la página
window.cargarDatosGlobales();

window.obtenerListaFamiliares = function () {
    if (window.familiares && window.familiares.length > 0) {
        return window.familiares;
    }
    // Si la variable global falló o no ha cargado, intentamos leer del caché local
    const cache = JSON.parse(localStorage.getItem('app_cache_familiares')) || [];
    return cache;


};