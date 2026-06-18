// 1. Inicializamos la variable global con lo que haya en caché
// Inicializamos la variable global con la misma clave de caché que guardamos abajo
window.familiares = JSON.parse(localStorage.getItem('app_cache_familiares')) || [];

// 2. Definimos la función de actualización masiva
window.cargarDatosGlobales = async function() {
    console.log("🔄 [main.js] Intentando conectar con Google Apps Script...");
    const url = "https://script.google.com/macros/s/AKfycbyl9NenydiCUF-XLNXWYnRX_xSRXJ3S00djvjgjUyIT2cBrHJeqbeJ0c5VPGFhvob5eLg/exec";
    
    try {
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        
        console.log("📥 [main.js] Datos crudos recibidos desde Google Sheet:", data);
        
        // CORRECCIÓN: Ya no usamos .slice(1) ni fila[0]. Leemos los objetos directos que manda tu Google Script
        window.familiares = data.map(usuario => ({
            nombre: usuario.nombre ? String(usuario.nombre).trim() : "",
            password: usuario.password ? String(usuario.password).trim() : "",
            celular: usuario.celular ? String(usuario.celular).trim() : ""
        }));
        
        console.log("✅ [main.js] Usuarios procesados y listos en memoria:", window.familiares);
        
        // Guardamos la copia fresca en el dispositivo
        localStorage.setItem('app_cache_familiares', JSON.stringify(window.familiares));
        
    } catch (e) {
        console.error("❌ [main.js] Error crítico al descargar datos desde Google Sheets:", e);
    }
};

// 🔥 ¡ESTA LÍNEA ES CLAVE! Ejecuta la función en segundo plano nada más abrir la página
window.cargarDatosGlobales();

window.obtenerListaFamiliares = function() {
    if (window.familiares && window.familiares.length > 0) {
        return window.familiares;
    }
    // Si la variable global falló o no ha cargado, intentamos leer del caché local
    const cache = JSON.parse(localStorage.getItem('app_cache_familiares')) || [];
    console.log("📦 [api.js] Leyendo lista desde el almacenamiento local Caché:", cache);
    return cache;
};