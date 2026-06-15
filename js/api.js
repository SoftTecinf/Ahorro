window.familiares = JSON.parse(localStorage.getItem('app_familiares')) || [];
//        const respuesta = await fetch('https://script.google.com/macros/s/AKfycbxTFZLLfvP8cywVA8IzMsVa0BPA9OeLieUV-6Cgg_XNxLZLH6Uxzx_QpfdOzMH3x2wdVQ/exec');


async function cargarDatosGlobales() {
    console.log("Conectando a Google Apps Script...");
    // Esta es tu nueva URL
    const url = "https://script.google.com/macros/s/AKfycbxTFZLLfvP8cywVA8IzMsVa0BPA9OeLieUV-6Cgg_XNxLZLH6Uxzx_QpfdOzMH3x2wdVQ/exec";
    
    try {
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        
        // Convertimos el formato de Google (array de arrays) a objetos
        window.familiares = data.slice(1).map(fila => ({
            nombre: fila[0],    // Columna A
            password: fila[1],  // Columna B
            celular: fila[2]    // Columna C
        }));
        
        console.log("¡Éxito! Datos cargados:", window.familiares);
    } catch (e) {
        console.error("Error al conectar con la nueva API:", e);
    }
}

// En js/api.js
window.obtenerListaFamiliares = function() {
    return window.familiares && window.familiares.length > 0 
        ? window.familiares 
        : (JSON.parse(localStorage.getItem('app_familiares')) || []);
};