// En api.js
window.familiares = []; // Inicializamos como array vacío global

async function cargarDatos() {
    try {
        const respuesta = await fetch('https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/usuarios');
        const datos = await respuesta.json();
        
        // ¡IMPORTANTE! Revisa cómo se llama la clave en tu JSON (¿es 'hoja1' o 'usuarios'?)
        // Puedes ver esto haciendo console.log(datos) antes de esta línea.
        window.familiares = datos.usuarios || datos.hoja1 || []; 
        
        console.log("Datos cargados en window.familiares:", window.familiares);
    } catch (error) {
        console.error("Error al conectar con la nube:", error);
    }
}

// Llamamos a la función al cargar
cargarDatos();
