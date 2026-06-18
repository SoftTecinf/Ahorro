// 1. Inicializamos la variable global con lo que haya en caché
window.familiares = JSON.parse(localStorage.getItem('app_familiares')) || [];

// 2. Definimos la función de actualización masiva
window.cargarDatosGlobales = async function() {
    console.log("🔄 [main.js] Intentando conectar con Google Apps Script...");
    const url = "https://script.google.com/macros/s/AKfycbzFjQ3ayf9RExQChE9zmcg2acPaoHhRVXjzvnHWliy9f7--4NPSh9P5BW3DjVURn4i_Ug/exec";
    
    try {
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        
        console.log("📥 [main.js] Datos crudos recibidos desde Google Sheet:", data);
        
        // Procesamos filas omitiendo los encabezados
        window.familiares = data.slice(1).map(fila => ({
            nombre: fila[0] ? String(fila[0]).trim() : "",
            password: fila[1] ? String(fila[1]).trim() : "",
            celular: fila[2] ? String(fila[2]).trim() : ""
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