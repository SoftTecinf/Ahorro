// api.js - Fuente única de verdad
window.usuarios = [];
window.proyectos = [];
window.cuentas = [];

async function cargarDatosGlobales() {
    const URLs = {
        usuarios: 'https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/usuarios',
        proyectos: 'https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/proyectos',
        cuentas: 'https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/cuentas'
    };

    for (const [key, url] of Object.entries(URLs)) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("API bloqueada");
            const data = await res.json();
            
            // Accedemos a la clave correcta (Sheety usa el nombre de la hoja como clave)
            const listaDatos = data[key] || data.hoja1 || data; 
            
            localStorage.setItem(`datos_${key}`, JSON.stringify(listaDatos));
            window[key] = listaDatos;
            console.log(`Datos de ${key} cargados exitosamente.`);
        } catch (e) {
            console.warn(`Usando caché local para ${key}.`);
            window[key] = JSON.parse(localStorage.getItem(`datos_${key}`)) || [];
        }
    }
}

// Ejecutamos una sola vez al cargar la app
cargarDatosGlobales();