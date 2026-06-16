window.familiares = JSON.parse(localStorage.getItem('app_familiares')) || [];
//        const respuesta = await fetch('https://script.google.com/macros/s/AKfycbxTFZLLfvP8cywVA8IzMsVa0BPA9OeLieUV-6Cgg_XNxLZLH6Uxzx_QpfdOzMH3x2wdVQ/exec');


// En tu archivo main.js
// En main.js, asegúrate que se vea así:
window.cargarDatosGlobales = async function() {
    console.log("Conectando a Google Apps Script...");
    const url = "https://script.google.com/macros/s/AKfycbxTFZLLfvP8cywVA8IzMsVa0BPA9OeLieUV-6Cgg_XNxLZLH6Uxzx_QpfdOzMH3x2wdVQ/exec";
    
    try {
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        
        window.familiares = data.slice(1).map(fila => ({
            nombre: fila[0],
            password: fila[1],
            celular: fila[2]
        }));
        
        console.log("Datos cargados exitosamente.");
    } catch (e) {
        console.error("Error al cargar datos:", e);
    }
};

// En js/api.js
window.obtenerListaFamiliares = function() {
    return window.familiares && window.familiares.length > 0 
        ? window.familiares 
        : (JSON.parse(localStorage.getItem('app_familiares')) || []);
};