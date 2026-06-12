// js/api.js
window.familiares = JSON.parse(localStorage.getItem('app_familiares')) || [];

// En js/api.js, asegúrate de tener una función como esta:
async function cargarDatosGlobales() {
    try {
        const res = await fetch('URL_DE_TU_SHEETY');
        const data = await res.json();
        window.familiares = data.usuarios;
        localStorage.setItem('cache_familiares', JSON.stringify(data.usuarios));
    } catch (e) {
        // Si la API falla (402), cargamos del caché
        window.familiares = JSON.parse(localStorage.getItem('cache_familiares')) || [];
    }
}