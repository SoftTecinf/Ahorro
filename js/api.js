// js/api.js
window.familiares = JSON.parse(localStorage.getItem('app_familiares')) || [];

async function cargarDatosGlobales() {
    // Si ya tenemos datos, no satures la API
    if (window.familiares.length > 0) return; 

    try {
        const res = await fetch('https://api.sheety.co/f600b8b3553fb0a7656cd10008f5885a/ahorro/usuarios');
        if (res.ok) {
            const data = await res.json();
            window.familiares = data.usuarios;
            localStorage.setItem('app_familiares', JSON.stringify(data.usuarios));
        }
    } catch (e) {
        console.warn("API bloqueada, usando datos locales");
    }
}