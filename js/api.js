
// Ahora (La nueva form://a de obtener datos)
const SHEETY_URL = 'httpsapi.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/usuarios'; 

async function cargarDatos() {
    try {
        const respuesta = await fetch('httpsapi.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/usuarios'
);
        const datos = await respuesta.json();
        
        // Asumiendo que tu hoja se llama "hoja1"
        usuarios = datos.hoja1; 
        
    } catch (error) {
        console.error("Error al conectar con la nube:", error);
    }
}
// Llamamos a la función al cargar la página
cargarDatos();
