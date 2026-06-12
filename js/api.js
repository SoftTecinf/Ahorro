// En js/api.js
async function cargarDatosGlobales() {
    // Primero, intenta cargar desde localStorage para no saturar la API
    const cache = localStorage.getItem('app_familiares');
    if (cache) {
        window.familiares = JSON.parse(cache);
        console.log("Datos cargados desde caché");
    }

    // Solo si no hay caché o si decides actualizar, llama a la API
    try {
        const respuesta = await fetch('https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/usuarios');
        if (!respuesta.ok) throw new Error("API bloqueada o error");
        
        const data = await respuesta.json();
        window.familiares = data.usuarios; // O el nombre de tu tabla
        localStorage.setItem('app_familiares', JSON.stringify(data.usuarios));
    } catch (error) {
        console.warn("No se pudo actualizar desde la API, usando caché.");
    }
}