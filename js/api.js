// 1. Inicializamos la variable global con lo que haya en caché
// Inicializamos la variable global con la misma clave de caché que guardamos abajo
window.familiares = JSON.parse(localStorage.getItem('app_cache_familiares')) || [];

// 2. Definimos la función de actualización masiva
window.cargarDatosGlobales = async function() {
    const url = "https://script.google.com/macros/s/AKfycbyl9NenydiCUF-XLNXWYnRX_xSRXJ3S00djvjgjUyIT2cBrHJeqbeJ0c5VPGFhvob5eLg/exec";
    
    const respuesta = await fetch(url);
    const data = await respuesta.json(); // <-- Supongamos que aquí vienen { familiares: [...], proyectos: [...], cuentas: [...] }
    
    // Asignamos cada cosa a su variable global
    window.familiares = data.familiares || [];
    window.proyectos = data.proyectos || [];
    window.cuentas = data.cuentas || [];
    
    // Guardamos en caché
    localStorage.setItem('app_cache_familiares', JSON.stringify(window.familiares));
    localStorage.setItem('app_cache_proyectos', JSON.stringify(window.proyectos));
    localStorage.setItem('app_cache_cuentas', JSON.stringify(window.cuentas));
    
    console.log("✅ Datos cargados:", { proyectos: window.proyectos, cuentas: window.cuentas });
};

// 🔥 ¡ESTA LÍNEA ES CLAVE! Ejecuta la función en segundo plano nada más abrir la página
window.cargarDatosGlobales();

window.obtenerListaFamiliares = function() {
    if (window.familiares && window.familiares.length > 0) {
        return window.familiares;
    }
    // Si la variable global falló o no ha cargado, intentamos leer del caché local
    const cache = JSON.parse(localStorage.getItem('app_cache_familiares')) || [];
    return cache;
};