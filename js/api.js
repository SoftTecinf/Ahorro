
// Ahora (La nueva forma de obtener datos)
const SHEETY_URL = 'https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/familiares'; 

async function cargarDatos() {
    try {
        const respuesta = await fetch(SHEETY_URL);
        const datos = await respuesta.json();
        
        // Asumiendo que tu hoja se llama "hoja1"
        Usuarios = datos.hoja1; 
        
    } catch (error) {
        console.error("Error al conectar con la nube:", error);
    }
}
// Llamamos a la función al cargar la página
cargarDatos();