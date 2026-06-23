
function procesarInvitacionPendiente() {
    const idProyecto = sessionStorage.getItem('pending_proyecto');
    if (idProyecto && currentUser) {
        unirseAProyecto(idProyecto);
        sessionStorage.removeItem('pending_proyecto');
    }
}

function unirseAProyecto(proyectoId) {
    const proyecto = proyectos.find(p => p.id == proyectoId);
    if (proyecto) {
        if (!proyecto.participantes) proyecto.participantes = [];
        if (!proyecto.participantes.includes(currentUser)) {
            proyecto.participantes.push(currentUser);
            localStorage.setItem('app_proyectos', JSON.stringify(proyectos));
            mostrarModal(`¡Te has unido exitosamente al proyecto "${proyecto.nombre}"! 🔮`);
        }
        renderizarInicioProyectos();
    }
}


// ==========================================
// PROYECTOS Y LOGICA DE RENDIMIENTO (DOM)
// ==========================================

window.guardarProyecto = async function(event) {
    event.preventDefault();
    
    // Capturamos los valores
    const nombre = document.getElementById('datos-nombre-proyecto').value.trim();
    const fechaInicio = document.getElementById('datos-fecha-inicio').value;
    const monto = document.getElementById('datos-monto').value;
    const plazos = document.getElementById('datos-plazos').value;
    const frecuencia = document.getElementById('datos-frecuencia').value;

    // VALIDACIÓN CRÍTICA: Si algo está vacío, NO guardamos
    if (!nombre || !fechaInicio || !monto || !plazos || !frecuencia) {
        alert("⚠️ Por favor, llena todos los campos del proyecto.");
        return; // Detiene la ejecución aquí
    }

    // Si todo está bien, creamos el objeto
    const nuevoProyecto = {
        tipo: "proyecto",
        id: Date.now(),
        nombre: nombre,
        fechaInicio: fecha,
        frecuencia: frecuencia,
        monto: parseFloat(monto),
        plazos: parseInt(plazos),
        cuota: parseFloat(monto) / parseInt(plazos),
        adminName: window.currentUser || "Elena",
        participantes: [window.currentUser || "Elena"],
        historialDepositos: {}
    };

    // Enviamos a Google Sheets
    try {
        await fetch('https://script.google.com/macros/s/AKfycbyl9NenydiCUF-XLNXWYnRX_xSRXJ3S00djvjgjUyIT2cBrHJeqbeJ0c5VPGFhvob5eLg/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProyecto)
        });
        
        alert("¡Proyecto guardado con éxito!");
        // Aquí recargamos los datos
        await cargarDatosGlobales(); 
        renderizarGridProyectos();
    } catch (e) {
        alert("Error al guardar en la nube.");
    }
};

window.renderizarGridProyectos = function() {
    // 1. Buscamos el cuerpo de la tabla, NO el contenedor padre
    const tbody = document.getElementById('datos-tabla-proyectos-body');
    
    if (!tbody) {
        console.warn("❌ El cuerpo de la tabla 'datos-tabla-proyectos-body' no existe en el DOM.");
        return;
    }

    console.log("-> Renderizando tabla con:", window.proyectos); 

    if (!window.proyectos || window.proyectos.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6' class='p-4 text-center'>No hay proyectos registrados.</td></tr>";
        return;
    }

    // 2. Generamos las filas de la tabla
    tbody.innerHTML = window.proyectos.map(p => `
        <tr class="hover:bg-purple-50/50 transition-colors">
            <td class="p-3 font-medium text-purple-900">${p.nombre}</td>
            <td class="p-3">${p.fechaInicio}</td>
            <td class="p-3 capitalize">${p.frecuencia}</td>
            <td class="p-3 font-semibold">$${parseFloat(p.monto).toLocaleString()}</td>
            <td class="p-3 text-center">${p.plazos}</td>
            <td class="p-3 text-center">
                <button onclick="editarProyecto('${p.id}')" class="text-purple-600 hover:text-purple-800 font-bold">Editar</button>
            </td>
        </tr>
    `).join('');
    
    console.log("✅ Tabla renderizada correctamente.");
}


function editarProyecto(id) {
    const p = proyectos.find(x => x.id == id);
    if (!p) return;

    document.getElementById('datos-proyecto-id').value = p.id;
    document.getElementById('datos-nombre-proyecto').value = p.nombre;
    document.getElementById('datos-fecha-inicio').value = p.fechaInicio || new Date().toISOString().split('T')[0];
    document.getElementById('datos-monto').value = p.monto;
    document.getElementById('datos-plazos').value = p.plazos;
    document.getElementById('datos-frecuencia').value = p.frecuencia;

    document.getElementById('titulo-form-proyecto').innerHTML = `<span class="text-yellow-500">✏️</span> Editar Proyecto: ${p.nombre}`;
    document.getElementById('btn-guardar-proyecto').textContent = "🔄 Actualizar Proyecto";
    document.getElementById('btn-cancelar-proyecto').classList.remove('hidden');
    document.getElementById('titulo-form-proyecto').scrollIntoView({ behavior: 'smooth' });
}

function cancelarEdicionProyecto() {
    document.getElementById('form-proyectos').reset();
    document.getElementById('datos-proyecto-id').value = "";
    document.getElementById('titulo-form-proyecto').innerHTML = `<span class="text-purple-500">✨</span> 1. Registrar Nuevo Proyecto`;
    document.getElementById('btn-guardar-proyecto').textContent = "💾 Guardar Proyecto";
    document.getElementById('btn-cancelar-proyecto').classList.add('hidden');
}

function eliminarProyectoCompleto(id) {
    if (!confirm("¿Deseas eliminar permanentemente este proyecto y todos sus registros vinculados?")) return;
    proyectos = proyectos.filter(p => p.id !== id);
    localStorage.setItem('app_proyectos', JSON.stringify(proyectos));
    renderizarGridProyectos();
    renderizarInicioProyectos();
}

// ==========================================
// VISTA PRINCIPAL (TARJETAS LATERALES DE PROYECTO)
// ==========================================
async function renderizarInicioProyectos() {
    const contenedor = document.getElementById('inicio-container');
    if (!contenedor) return;

    // PONEMOS UN MENSAJE POR DEFECTO PARA QUE EL USUARIO VEA ALGO
    contenedor.innerHTML = '<p class="text-gray-400 p-4">No hay proyectos activos aún.</p>';

    try {

        const misProyectos = proyectos.filter(p => p.adminName === currentUser);

        if (misProyectos.length > 0) {
            // SOLO SI HAY DATOS, REEMPLAZAMOS EL CONTENIDO
            contenedor.innerHTML = misProyectos.map(p => `...tu html aquí...`).join('');
        }
    } catch (error) {
        console.error("Error cargando:", error);
    }
}

function verResumenProyectoInmediato(id) {
    const p = proyectos.find(x => x.id == id);
    const contenedor = document.getElementById('inicio-resumen-proyecto');
    const contenido = document.getElementById('resumen-contenido');
    if (!p || !contenedor || !contenido) return;

    contenedor.classList.remove('hidden');

    let txtCuenta = "Sin vincular (Efectivo)";
    if (p.idCuentaVinculada) {
        const c = cuentasBancarias.find(cta => cta.id === p.idCuentaVinculada);
        if (c) txtCuenta = `🏦 ${c.banco} — Clabe: ${c.cuenta}`;
    }

    let htmlParticipantes = p.participantes.map(name => {
        const depositos = p.historialDepositos[name] || [];
        const totalAhorrado = depositos.reduce((acc, d) => acc + d.monto, 0);

        return `
<div class="bg-gray-50/60 p-3.5 rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
<div>
<p class="text-sm font-bold text-gray-800">${name} ${name === p.adminName ? '👑' : ''}</p>
<p class="text-xs text-purple-600 font-semibold mt-0.5">Ahorrado: ${formatearMXN(totalAhorrado)}</p>
</div>
<div class="flex items-center gap-2">
<button onclick="abrirModalAbonos('${name}', ${p.id})" class="text-xs font-bold bg-white border text-gray-700 px-3 py-1.5 rounded-xl shadow-3xs hover:bg-purple-50 cursor-pointer">
📊 Historial / Abonar
</button>
</div>
</div>
`;
    }).join('');

    contenido.innerHTML = `
<div class="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
<div>
<span class="text-[10px] uppercase font-black text-purple-600 tracking-widest bg-purple-50 px-2 py-0.5 rounded Sundae">Plan Activo</span>
<h3 class="text-2xl font-black text-gray-900 mt-1">${p.nombre}</h3>
<p class="text-xs text-gray-400 mt-0.5">Frecuencia: <span class="font-bold text-gray-600">${p.frecuencia}</span> | Plazos: <span class="font-bold text-gray-600">${p.plazos}</span></p>
</div>
${p.adminName === currentUser ? `
<button onclick="abrirModalInvitacionExpress(${p.id})" class="bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer shadow-3xs">
➕ Invitar Familiar
</button>
` : ''}
</div>

<div class="grid grid-cols-2 gap-4 mb-6">
<div class="bg-purple-50/40 p-3 rounded-xl border border-purple-50">
<p class="text-[10px] font-bold uppercase text-gray-400">Meta Colectiva</p>
<p class="text-lg font-extrabold text-purple-950">${formatearMXN(p.monto)}</p>
</div>
<div class="bg-blue-50/40 p-3 rounded-xl border border-blue-50">
<p class="text-[10px] font-bold uppercase text-gray-400">Cuota Fija Sugerida</p>
<p class="text-lg font-extrabold text-blue-950">${formatearMXN(p.cuota)}</p>
</div>
</div>

<div class="mb-6 p-3.5 bg-slate-900 text-slate-100 rounded-2xl shadow-inner text-xs flex items-center justify-between">
<div>
<span class="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Cuenta para Aportes</span>
<span class="font-semibold tracking-wide">${txtCuenta}</span>
</div>
</div>

<h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">👥 Progreso por Integrante</h4>
<div class="space-y-2.5">${htmlParticipantes}</div>
`;
}

// ==========================================
// CATALOGO DE CUENTAS BANCARIAS
// ==========================================
function guardarCuentaBancaria(event) {
    event.preventDefault();
    const usuarioActual = localStorage.getItem('app_currentUser');
    if (!usuarioActual) return alert("Error: No se detectó un usuario activo.");

    const idInput = document.getElementById('cuenta-id').value;
    const banco = document.getElementById('cuenta-banco').value.trim();
    const titular = document.getElementById('cuenta-titular').value.trim();
    const cuenta = document.getElementById('cuenta-clabe').value.trim();

    if (idInput) {
        const idx = cuentasBancarias.findIndex(c => c.id == idInput);
        if (idx !== -1) {
            cuentasBancarias[idx].banco = banco;
            cuentasBancarias[idx].titular = titular;
            cuentasBancarias[idx].cuenta = cuenta;
            if (!cuentasBancarias[idx].adminName) cuentasBancarias[idx].adminName = usuarioActual;
        }
        mostrarModal(`Cuenta de "${titular}" modificada exitosamente.`);
    } else {
        const nuevaCuenta = { id: "cta_" + Date.now(), adminName: usuarioActual, banco, titular, cuenta };
        cuentasBancarias.push(nuevaCuenta);
        mostrarModal(`Cuenta bancaria de "${titular}" añadida.`);
    }

    localStorage.setItem('app_cuentas_bancarias', JSON.stringify(cuentasBancarias));
    cancelarEdicionCuenta();
    renderizarGridCuentas();
}

function renderizarGridCuentas() {
    const tbody = document.getElementById('datos-tabla-cuentas-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const usuarioActual = localStorage.getItem('app_currentUser');
    const misCuentas = cuentasBancarias.filter(c => !c.adminName || c.adminName === usuarioActual);

    if (misCuentas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-xs text-center text-gray-400 italic">No hay cuentas bancarias registradas.</td></tr>`;
        return;
    }

    misCuentas.forEach(c => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-blue-50/30 transition-colors";
        tr.innerHTML = `
<td class="p-3 font-bold text-gray-800">${c.banco}</td>
<td class="p-3 text-gray-600">${c.titular}</td>
<td class="p-3 font-mono text-blue-900 font-medium">${c.cuenta}</td>
<td class="p-3 text-center space-x-2">
<button onclick="editarCuentaBancaria('${c.id}')" class="text-xs text-yellow-600 hover:underline cursor-pointer">Editar</button>
<button onclick="eliminarCuentaBancariaReal('${c.id}')" class="text-xs text-red-500 hover:underline cursor-pointer">Eliminar</button>
</td>
`;
        tbody.appendChild(tr);
    });
}

function editarCuentaBancaria(id) {
    const c = cuentasBancarias.find(x => x.id == id);
    if (!c) return;

    document.getElementById('cuenta-id').value = c.id;
    document.getElementById('cuenta-banco').value = c.banco;
    document.getElementById('cuenta-titular').value = c.titular;
    document.getElementById('cuenta-clabe').value = c.cuenta;

    document.getElementById('titulo-form-cuenta').innerHTML = `<span class="text-yellow-500">✏️</span> Editar Cuenta Bancaria`;
    document.getElementById('btn-guardar-cuenta').textContent = "🔄 Actualizar Cuenta";
    document.getElementById('btn-cancelar-cuenta').classList.remove('hidden');
    document.getElementById('titulo-form-cuenta').scrollIntoView({ behavior: 'smooth' });
}

function cancelarEdicionCuenta() {
    document.getElementById('form-cuentas').reset();
    document.getElementById('cuenta-id').value = "";
    document.getElementById('titulo-form-cuenta').innerHTML = `<span class="text-blue-600">💳</span> 2. Registro de Cuentas Bancarias`;
    document.getElementById('btn-guardar-cuenta').textContent = "➕ Agregar Cuenta";
    document.getElementById('btn-cancelar-cuenta').classList.add('hidden');
}

function eliminarCuentaBancariaReal(id) {
    if (!confirm("¿Deseas eliminar esta cuenta bancaria?")) return;
    cuentasBancarias = cuentasBancarias.filter(c => c.id !== id);
    localStorage.setItem('app_cuentas_bancarias', JSON.stringify(cuentasBancarias));

    proyectos.forEach(p => {
        if (p.idCuentaVinculada === id) p.idCuentaVinculada = null;
    });
    localStorage.setItem('app_proyectos', JSON.stringify(proyectos));
    renderizarGridCuentas();
}

// ==========================================
// CONFIGURACIÓN Y ASIGNACIONES
// ==========================================

async function actualizarSelectoresConfig() {
    // Si la variable está vacía, no intentes filtrar
    if (!cacheProyectos) {
        console.warn("Proyectos aún no disponibles.");
        return;
    }
    
    const misProyectos = cacheProyectos.filter(p => p.adminName === currentUser);
    // ... resto del código
}

function guardarConfiguracionProyecto(event) {
    event.preventDefault();
    const idProy = document.getElementById('config-select-proyecto').value;
    const idCta = document.getElementById('config-select-cuenta').value;

    if (!idProy) return alert("Selecciona un proyecto válido.");

    const proyecto = proyectos.find(p => p.id == idProy);
    if (proyecto) {
        proyecto.idCuentaVinculada = idCta || null;
        localStorage.setItem('app_proyectos', JSON.stringify(proyectos));
        mostrarModal("¡Vínculos y cuentas asignadas al proyecto correctamente! ✨");
        navegarA('sec-inicio');
    }
}

// ==========================================
// GESTIÓN DE ABONOS Y MODALES DE INTEGRANTES
// ==========================================
let idProyectoModalActivo = null;
let nombreIntegranteModalActivo = "";

function abrirModalAbonos(nombre, proyectoId) {
    const p = proyectos.find(x => x.id == proyectoId);
    if (!p) return;

    idProyectoModalActivo = proyectoId;
    nombreIntegranteModalActivo = nombre;

    document.getElementById('modal-titulo-nombre').textContent = `Historial de ${nombre}`;
    document.getElementById('modal-subtitulo-proyecto').textContent = `Plan: ${p.nombre}`;
    document.getElementById('modal-cuota-fija-texto').textContent = formatearMXN(p.cuota);
    document.getElementById('deposito-fecha').value = new Date().toISOString().split('T')[0];
    document.getElementById('deposito-cantidad-abonos').value = "1";

    calcularMontoPorAbonos();
    renderizarListaAbonosModal();

    const formAbono = document.getElementById('form-nuevo-deposito');
    if (nombre !== currentUser) {
        formAbono.classList.add('hidden');
    } else {
        formAbono.classList.remove('hidden');
    }

    document.getElementById('modal-deposito-familiar').classList.remove('hidden');
}

function cerrarModalDeposito() {
    const modal = document.getElementById('modal-deposito-familiar');
    if (modal) modal.classList.add('hidden');
    idProyectoModalActivo = null;
    nombreIntegranteModalActivo = "";
}

function calcularMontoPorAbonos() {
    const p = proyectos.find(x => x.id == idProyectoModalActivo);
    const tipoAbono = document.getElementById('deposito-cantidad-abonos').value;
    const inputMonto = document.getElementById('deposito-monto');

    if (!p || !inputMonto) return;

    if (tipoAbono === 'manual') {
        inputMonto.readOnly = false;
        inputMonto.value = "";
        inputMonto.focus();
    } else {
        inputMonto.readOnly = true;
        const multiplicador = parseInt(tipoAbono) || 1;
        inputMonto.value = (p.cuota * multiplicador).toFixed(2);
    }
}

function guardarAbonoIntegrante(event) {
    event.preventDefault();
    const p = proyectos.find(x => x.id == idProyectoModalActivo);
    if (!p) return;

    const fecha = document.getElementById('deposito-fecha').value;
    const monto = parseFloat(document.getElementById('deposito-monto').value) || 0;
    const metodo = document.getElementById('deposito-metodo').value;
    const fileFoto = document.getElementById('deposito-foto').files[0];

    if (monto <= 0) return alert("Ingresa un monto válido.");

    const nuevoDeposito = {
        id: "dep_" + Date.now(),
        fecha,
        monto,
        metodo,
        comprobanteUrl: ""
    };

    const realizarGuardado = () => {
        if (!p.historialDepositos[nombreIntegranteModalActivo]) {
            p.historialDepositos[nombreIntegranteModalActivo] = [];
        }
        p.historialDepositos[nombreIntegranteModalActivo].push(nuevoDeposito);
        localStorage.setItem('app_proyectos', JSON.stringify(proyectos));

        document.getElementById('form-nuevo-deposito').reset();
        document.getElementById('deposito-fecha').value = new Date().toISOString().split('T')[0];
        document.getElementById('deposito-cantidad-abonos').value = "1";
        calcularMontoPorAbonos();

        renderizarListaAbonosModal();
        verResumenProyectoInmediato(p.id);
        mostrarModal("¡Aportación de ahorro guardada con éxito! 💵");
    };

    if (fileFoto) {
        const reader = new FileReader();
        reader.onload = function (e) {
            nuevoDeposito.comprobanteUrl = e.target.result;
            realizarGuardado();
        };
        reader.readAsDataURL(fileFoto);
    } else {
        realizarGuardado();
    }
}

function renderizarListaAbonosModal() {
    const p = proyectos.find(x => x.id == idProyectoModalActivo);
    const contenedor = document.getElementById('modal-lista-abonos');
    if (!p || !contenedor) return;

    const listado = p.historialDepositos[nombreIntegranteModalActivo] || [];

    if (listado.length === 0) {
        contenedor.innerHTML = '<p class="text-xs text-gray-400 italic text-center py-2">No se han registrado aportes.</p>';
        return;
    }

    contenedor.innerHTML = listado.slice().reverse().map(d => `
<div class="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center text-xs">
<div>
<p class="font-bold text-gray-900">${formatearMXN(d.monto)} <span class="font-normal text-gray-400">(${d.metodo})</span></p>
<p class="text-[10px] text-gray-500 mt-0.5">${revertirFechaMX(d.fecha)}</p>
</div>
<div class="flex items-center gap-1.5">
${d.comprobanteUrl ? `
<button onclick="verFotoComprobante('${d.comprobanteUrl}')" class="bg-purple-100 text-purple-700 font-bold px-2 py-1 rounded text-[10px] cursor-pointer">🖼️ Ticket</button>
` : ''}
${nombreIntegranteModalActivo === currentUser ? `
<button onclick="eliminarAbonoReal('${d.id}')" class="text-red-500 font-bold text-lg px-1 cursor-pointer">&times;</button>
` : ''}
</div>
</div>
`).join('');
}

function verFotoComprobante(base64Data) {
    const viewer = document.getElementById('modal-viewer-foto');
    const img = document.getElementById('img-viewer-src');
    if (viewer && img) {
        img.src = base64Data;
        viewer.classList.remove('hidden');
    }
}

// ==========================================
// INVITAR INTEGRANTES POR WHATSAPP E INTERNO
// ==========================================
function abrirModalInvitacionExpress(idProy) {
    document.getElementById('invitacion-id-proyecto-actual').value = idProy;
    document.getElementById('input-celular-modal').value = "";
    document.getElementById('modal-invitacion-directa').classList.remove('hidden');
}

function enviarInvitacionWhatsApp(event) {
    const idProy = document.getElementById('invitacion-id-proyecto-actual').value;
    const celularInput = document.getElementById('input-celular-modal');
    const btnWhatsapp = document.getElementById('btn-whatsapp-link');

    if (!celularInput || !btnWhatsapp) return;

    let celular = celularInput.value.trim();
    const regexCelular = /^[0-9]{10}$/;

    // VALIDACIÓN DE 10 DÍGITOS
    if (!regexCelular.test(celular)) {
        event.preventDefault(); // Evita que intente abrir WhatsApp si está mal el número
        alert("❌ El número de celular debe contener exactamente 10 dígitos numéricos.");
        celularInput.focus();
        return;
    }

    const p = proyectos.find(x => x.id == idProy);
    if (!p) {
        event.preventDefault();
        return;
    }

    // Guardar la invitación interna indexada por celular
    const nuevaInvitacion = {
        id: Date.now(),
        proyectoId: p.id,
        proyectoNombre: p.nombre,
        celularInvitado: celular,
        creador: currentUser
    };

    if (!invitacionesPendientes.some(i => i.proyectoId === p.id && i.celularInvitado === celular)) {
        invitacionesPendientes.push(nuevaInvitacion);
        localStorage.setItem('app_invitaciones', JSON.stringify(invitacionesPendientes));
    }

    // TU LIGA DE CANVA
    const baseUri = "https://softtecinf.github.io/Ahorro/";
    const linkCompleto = `${baseUri}?proyecto=${p.id}`;
    const mensaje = `¡Hola! 👋 ${usuarioActual} te invita a nuestra app de 'Ahorro Familiar' para organizar nuestras metas juntos.
\n\nTe invito especialmente a participar en el proyecto: *${nombreProyecto}*. 💎
\n\nDa Clic en el siguiente enlace: ${linkCompleto}`;


    // CONSTRUIR API WHATSAPP CON EL PREFIJO 52 AUTOMÁTICO
    const apiWhatsapp = `https://api.whatsapp.com/send?phone=52${celular}&text=${encodeURIComponent(mensaje)}`;

    // ASIGNAR EL ENLACE DIRECTO (Forma nativa que Canva no puede bloquear)
    btnWhatsapp.href = apiWhatsapp;

    // Ocultar el modal después de una pequeña fracción de segundo para no interrumpir el clic
    setTimeout(() => {
        document.getElementById('modal-invitacion-directa').classList.add('hidden');
    }, 300);
}

// CORREGIDO: Ahora busca y le notifica en tiempo real al usuario logueado
function renderizarInvitaciones() {
    const contenedor = document.getElementById('contenedor-invitaciones');
    const lista = document.getElementById('lista-invitaciones');
    if (!contenedor || !lista) return;

    if (!currentUser) {
        contenedor.classList.add('hidden');
        return;
    }

    // Buscar el celular del usuario activo actual
    const familiarActivo = familiares.find(f => f.nombre.toLowerCase() === currentUser.toLowerCase());
    if (!familiarActivo || !familiarActivo.celular) {
        contenedor.classList.add('hidden');
        return;
    }

    // Filtrar invitaciones destinadas al celular de este usuario y donde aún no sea participante
    const misInvitaciones = invitacionesPendientes.filter(i =>
        i.celularInvitado === familiarActivo.celular &&
        proyectos.some(p => p.id === i.proyectoId && !p.participantes.includes(currentUser))
    );

    if (misInvitaciones.length === 0) {
        contenedor.classList.add('hidden');
        return;
    }

    contenedor.classList.remove('hidden');
    lista.innerHTML = misInvitaciones.map(inv => `
<div class="bg-white p-3 rounded-xl border border-yellow-100 shadow-xs space-y-2 text-xs">
<p class="text-gray-700 font-medium">Fuiste invitado por <span class="font-bold text-purple-700">${inv.creador}</span> al proyecto:</p>
<p class="font-bold text-gray-900 text-sm bg-yellow-50/50 p-1.5 rounded-lg border border-yellow-50 text-center">${inv.proyectoNombre}</p>
<div class="flex gap-2 pt-1">
<button onclick="aceptarInvitacionInterna(${inv.id}, ${inv.proyectoId})" class="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 rounded-lg text-[11px] cursor-pointer shadow-3xs">Aceptar</button>
<button onclick="rechazarInvitacionInterna(${inv.id})" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-1.5 rounded-lg text-[11px] cursor-pointer">Ignorar</button>
</div>
</div>
`).join('');
}

function aceptarInvitacionInterna(invitacionId, proyectoId) {
    unirseAProyecto(proyectoId);
    invitacionesPendientes = invitacionesPendientes.filter(i => i.id !== invitacionId);
    localStorage.setItem('app_invitaciones', JSON.stringify(invitacionesPendientes));
    renderizarInvitaciones();
}

function rechazarInvitacionInterna(invitacionId) {
    invitacionesPendientes = invitacionesPendientes.filter(i => i.id !== invitacionId);
    localStorage.setItem('app_invitaciones', JSON.stringify(invitacionesPendientes));
    renderizarInvitaciones();
}



// ==========================================
// HELPERS TEMPORALES Y MONEDAS
// ==========================================
function formatearMXN(valor) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);
}

function revertirFechaMX(fechaCadena) {
    if (!fechaCadena) return '---';
    const partes = fechaCadena.split('-');
    if (partes.length !== 3) return fechaCadena;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function calcularFechaPlazo(fechaInicioStr, numeroPlazo, frecuencia) {
    if (!fechaInicioStr) return '---';
    let date = new Date(fechaInicioStr.replace(/-/g, '\/'));

    if (frecuencia === 'Semanal') {
        date.setDate(date.getDate() + (numeroPlazo * 7));
    } else if (frecuencia === 'Quincenal') {
        date.setDate(date.getDate() + (numeroPlazo * 15));
    } else if (frecuencia === 'Mensual') {
        date.setMonth(date.getMonth() + numeroPlazo);
    }

    return date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function actualizarLabelUsuario() {
    const label = document.getElementById('label-usuario-actual');
    if (label) {
        label.textContent = currentUser ? `👤 ${currentUser}` : "No identificado";
    }
}

function mostrarModal(msg) {
    const m = document.getElementById('success-modal');
    const txt = document.getElementById('success-message');
    if (m && txt) {
        txt.textContent = msg;
        m.classList.remove('hidden');
    }
}

function cerrarModal() {
    document.getElementById('success-modal').classList.add('hidden');
}


