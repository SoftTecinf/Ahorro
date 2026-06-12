// En api.js
window.familiares = []; // Inicializamos como array vacío global

async function cargarDatos() {
    try {
        const respuesta = await fetch('https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/usuarios');
        if (!respuesta.ok) throw new Error("API bloqueada o no disponible");
        
        const datos = await respuesta.json();
        window.familiares = datos.usuarios || datos.hoja1 || [];
    } catch (error) {
        console.warn("Usando datos locales por error en API:", error);
        // Si la API falla, intentamos cargar desde localStorage
        window.familiares = JSON.parse(localStorage.getItem('app_familiares')) || [];
    }
}

// Llamamos a la función al cargar
cargarDatos();
