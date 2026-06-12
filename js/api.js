// js/api.js
window.usuarios = JSON.parse(localStorage.getItem('datos_usuarios')) || [];

async function cargarDatosGlobales() {
    try {
        const respuesta = await fetch('https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/usuarios');
        if (!respuesta.ok) throw new Error("API bloqueada");
        
        const datos = await respuesta.json();
        window.usuarios = datos.usuarios || [];
        // Guardamos en caché para cuando la API falle
        localStorage.setItem('datos_usuarios', JSON.stringify(window.usuarios));
    } catch (error) {
        console.warn("Usando caché local debido a:", error.message);
    }
}
cargarDatos();