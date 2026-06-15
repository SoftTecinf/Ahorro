window.familiares = JSON.parse(localStorage.getItem('app_familiares')) || [];

async function cargarDatosGlobales() {
    // 1. Si ya tenemos datos, no malgastamos peticiones a la API
    if (window.familiares.length > 0) {
        console.log("Usando datos locales existentes...");
        return;
    }

    try {
        console.log("Consultando API...");
        const respuesta = await fetch('https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/usuarios');
        
        if (!respuesta.ok) throw new Error("Error al conectar con Sheety");

        const data = await respuesta.json();
        
        // 2. Guardamos en variable global y localStorage
        window.familiares = data.usuarios;
        localStorage.setItem('app_familiares', JSON.stringify(data.usuarios));
        console.log("Datos actualizados desde la API.");
        
    } catch (error) {
        console.error("No se pudo obtener datos de la API:", error);
    }
}

// En js/api.js
window.obtenerListaFamiliares = function() {
    return window.familiares && window.familiares.length > 0 
        ? window.familiares 
        : (JSON.parse(localStorage.getItem('app_familiares')) || []);
};