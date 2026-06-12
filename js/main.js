let familiares = JSON.parse(localStorage.getItem('app_familiares')) || [];
let proyectos = [];
let cuentasBancarias = [];
let invitacionesPendientes = [];
let currentUser = localStorage.getItem('app_currentUser') || '';
let cacheProyectos = [];
let cacheCuentas = [];
let datosCargados = false;

// ==========================================
// CONTROL DE NAVEGACIÓN ENTRE SECCIONES
// ==========================================
// ========================================== 'https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/proyectos'
// En api.js, centraliza la carga
// Sustituye tu lógica actual en api.js por esta estructura segura:
/*async function cargarDatosGlobales() {
    const URLs = {
        usuarios: 'https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/usuarios',
        proyectos: 'https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/proyectos',
        cuentas: 'https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/cuentas'
    };

for (const [key, url] of Object.entries(URLs)) {
    try {
       // const res = await fetch(url);
       // if (!res.ok) throw new Error("API bloqueada");
       // const data = await res.json();
        
        // --- AQUÍ ESTÁ EL AJUSTE ---
        // Sheety suele devolver los datos bajo una clave que es el nombre de la hoja.
        // Si el JSON es { "usuarios": [...] }, accedemos así:
        const listaDatos = data[key] || data.hoja1 || data; 
        
        localStorage.setItem(`datos_${key}`, JSON.stringify(listaDatos));
        window[key] = listaDatos; 
        console.log(`Datos de ${key} cargados desde API`);
    } catch (e) {
        console.warn(`Usando caché local para ${key}`);
        const localData = localStorage.getItem(`datos_${key}`);
        window[key] = localData ? JSON.parse(localData) : [];
    }
}
}*/

// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM listo. Iniciando aplicación...");
    // Solo ahora intenta mostrar el modal o la vista
    if (document.getElementById('modal-identidad')) {
        // Tu lógica de mostrar modal
    }
});

// Asegúrate de que esta función esté definida solo una vez en todo tu proyecto
// main.js - versión simplificada y segura
async function cargarDatos() {
    try {
        //const res = await fetch('URL_DE_SHEETY');
        //if (!res.ok) throw new Error("API bloqueada");
        //const data = await res.json();
        //localStorage.setItem('cache_data', JSON.stringify(data)); // Guarda copia
    } catch (e) {
        console.warn("API bloqueada. Usando datos guardados.");
        const datosLocales = localStorage.getItem('cache_data');
        window.familiares = datosLocales ? JSON.parse(datosLocales) : [];
    }
}


// ==========================================
// INICIALIZACIÓN UNIFICADA DE LA APP
// ==========================================
// 1. Asegúrate de que esta función sea global y robusta
// En main.js (o donde esté tu función)
function actualizarLabelUsuario() {
    const label = document.getElementById('user-label');
    const usuario = localStorage.getItem('app_currentUser');
    
    if (label) {
        label.innerText = usuario ? usuario : "Invitado";
    }
}


/// En js/main.js
// js/main.js
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Ocultar todo lo que no deba verse al principio
    const modalIdentidad = document.getElementById('modal-identidad');
    modalIdentidad.style.display = 'flex'; // Solo lo mostramos nosotros manualmente

    // 2. Cargamos datos
    await cargarDatosGlobales();
    
    // 3. Verificamos sesión
 // Dentro de tu lógica de carga inicial:
const usuario = localStorage.getItem('app_currentUser');
const modalLogin = document.getElementById('modal-identidad');

if (usuario) {
    currentUser = usuario;
    actualizarLabelUsuario();
    
    // FORZAR LA OCULTACIÓN DEL MODAL
    if (modalLogin) {
        modalLogin.classList.add('hidden'); // Esto elimina el login de la vista
    }
    
    cargarVista('inicio');
} else {
    // Si no hay usuario, mostrar el login
    if (modalLogin) {
        modalLogin.classList.remove('hidden');
    }
}});

// Listener de navegación
// En js/main.js

