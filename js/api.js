window.familiares = JSON.parse(localStorage.getItem('app_familiares')) || [];
//        const respuesta = await fetch('https://script.google.com/macros/s/AKfycbxTFZLLfvP8cywVA8IzMsVa0BPA9OeLieUV-6Cgg_XNxLZLH6Uxzx_QpfdOzMH3x2wdVQ/exec');


async function cargarDatosGlobales() {
    console.log("Conectando a mi API gratuita...");
    // PEGA AQUÍ TU URL QUE TERMINA EN /exec
    const url = "https://script.google.com/macros/s/AKfycbxTFZLLfvP8cywVA8IzMsVa0BPA9OeLieUV-6Cgg_XNxLZLH6Uxzx_QpfdOzMH3x2wdVQ/exec"; 
    
    try {
        const respuesta = await fetch(url);
        const data = await respuesta.json();
        
        // Google Apps Script devuelve un array de arrays. 
        // Convertimos ese formato a objetos para que tu App lo entienda:
        // Nota: Ajusta los índices [0], [1], [2] según el orden de tus columnas en el Sheet
        window.familiares = data.slice(1).map(fila => ({
            nombre: fila[0],    
            password: fila[1], 
            celular: fila[2]
        }));
        
        console.log("¡Éxito! Datos cargados:", window.familiares);
        // Guardamos en localStorage para que la app sea rápida
        localStorage.setItem('app_familiares', JSON.stringify(window.familiares));
    } catch (e) {
        console.error("Error conectando a la API:", e);
    }
}

// En js/api.js
window.obtenerListaFamiliares = function() {
    return window.familiares && window.familiares.length > 0 
        ? window.familiares 
        : (JSON.parse(localStorage.getItem('app_familiares')) || []);
};