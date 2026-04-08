// ------------------------- DATOS SIMULADOS (comidas, bebidas, promos, precios USD)
const menuData = [
    { id: 1, nombre: "Hamburguesa Clásica", precio: 8.99, icono: "🍔", tipo: "menu" },
    { id: 2, nombre: "Pizza Pepperoni", precio: 12.50, icono: "🍕", tipo: "menu" },
    { id: 3, nombre: "Ensalada César", precio: 7.25, icono: "🥗", tipo: "menu" },
    { id: 4, nombre: "Pasta Alfredo", precio: 11.90, icono: "🍝", tipo: "menu" },
    { id: 5, nombre: "Costillas BBQ", precio: 15.99, icono: "🍖", tipo: "menu" },
    { id: 6, nombre: "Tacos al pastor", precio: 9.50, icono: "🌮", tipo: "menu" },
];
const bebidasData = [
    { id: 101, nombre: "Refresco Cola", precio: 2.50, icono: "🥤", tipo: "bebida" },
    { id: 102, nombre: "Jugo Natural", precio: 3.20, icono: "🧃", tipo: "bebida" },
    { id: 103, nombre: "Cerveza Artesanal", precio: 4.50, icono: "🍺", tipo: "bebida" },
    { id: 104, nombre: "Limonada Frozen", precio: 3.80, icono: "🍋", tipo: "bebida" },
    { id: 105, nombre: "Agua Mineral", precio: 1.80, icono: "💧", tipo: "bebida" },
];
const promocionesData = [
    { id: 201, nombre: "Combo Familiar (2 hamb + papas)", precio: 18.99, icono: "🍟", desc: "Ahorra $4", tipo: "promo" },
    { id: 202, nombre: "2x1 en Pizzas", precio: 14.99, icono: "🍕🍕", desc: "Lunes y martes", tipo: "promo" },
    { id: 203, nombre: "Happy Hour Bebidas", precio: 1.99, icono: "🍻", desc: "3pm - 6pm", tipo: "promo" },
];

// Estado de la aplicación
let currentUser = null;  // { nombre, email, direccion }
let carrito = []; // { id, nombre, precio, cantidad, icono, tipo }

// Elementos DOM
const menuGrid = document.getElementById('menuGrid');
const bebidasGrid = document.getElementById('bebidasGrid');
const promosGrid = document.getElementById('promosGrid');
const cartItemsList = document.getElementById('cartItemsList');
const cartTotalSpan = document.getElementById('cartTotal');
const cartCountSpan = document.getElementById('cartCount');
const headerActions = document.getElementById('headerActions');
const datosUsuarioInfo = document.getElementById('datosUsuarioInfo');
const editNombre = document.getElementById('editNombre');
const editEmail = document.getElementById('editEmail');
const editDireccion = document.getElementById('editDireccion');
const actualizarDatosBtn = document.getElementById('actualizarDatosBtn');
const cambiarCuentaBtn = document.getElementById('cambiarCuentaBtn');
const vaciarCarritoBtn = document.getElementById('vaciarCarritoBtn');
const confirmarPagoBtn = document.getElementById('confirmarPagoBtn');
const paymentMsg = document.getElementById('paymentMsg');

// Helper renderizar items genéricos
function renderItems(container, items, addCallback) {
    container.innerHTML = '';
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card-item';
        card.innerHTML = `
            <div class="card-img">${item.icono}</div>
            <div class="card-info">
                <h4>${item.nombre}</h4>
                <div class="price">$${item.precio.toFixed(2)} USD</div>
                <button class="add-to-cart" data-id="${item.id}" data-nombre="${item.nombre}" data-precio="${item.precio}" data-icono="${item.icono}" data-tipo="${item.tipo}"><i class="fas fa-cart-plus"></i> Agregar</button>
            </div>
        `;
        container.appendChild(card);
    });
    // añadir eventos
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.removeEventListener('click', addHandler);
        btn.addEventListener('click', addHandler);
    });
}
function addHandler(e) {
    const btn = e.currentTarget;
    const id = parseInt(btn.dataset.id);
    const nombre = btn.dataset.nombre;
    const precio = parseFloat(btn.dataset.precio);
    const icono = btn.dataset.icono;
    const tipo = btn.dataset.tipo;
    agregarAlCarrito({ id, nombre, precio, icono, tipo });
}

function agregarAlCarrito(producto) {
    const existente = carrito.find(item => item.id === producto.id && item.tipo === producto.tipo);
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    if (!cartItemsList) return;
    if (carrito.length === 0) {
        cartItemsList.innerHTML = '<p><i class="fas fa-info-circle"></i> Carrito vacío. Agrega productos del menú o bebidas.</p>';
        cartTotalSpan.innerText = 'Total: $0.00 USD';
        cartCountSpan.innerText = '0';
        return;
    }
    let html = '';
    let total = 0;
    carrito.forEach((item, idx) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        html += `
            <div class="cart-item">
                <div><span>${item.icono} ${item.nombre}</span> x${item.cantidad}</div>
                <div>$${subtotal.toFixed(2)} 
                    <button class="btn-outline" style="padding:2px 8px; margin-left:8px;" data-removeidx="${idx}"><i class="fas fa-minus-circle"></i></button>
                    <button class="btn-outline" style="padding:2px 8px;" data-addidx="${idx}"><i class="fas fa-plus-circle"></i></button>
                </div>
            </div>
        `;
    });
    cartItemsList.innerHTML = html;
    cartTotalSpan.innerText = `Total: $${total.toFixed(2)} USD`;
    cartCountSpan.innerText = carrito.reduce((acc, i) => acc + i.cantidad, 0);
    // Eventos de cantidad
    document.querySelectorAll('[data-removeidx]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.dataset.removeidx);
            if (carrito[idx]) {
                if (carrito[idx].cantidad > 1) carrito[idx].cantidad--;
                else carrito.splice(idx,1);
                actualizarCarritoUI();
            }
        });
    });
    document.querySelectorAll('[data-addidx]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.dataset.addidx);
            if (carrito[idx]) {
                carrito[idx].cantidad++;
                actualizarCarritoUI();
            }
        });
    });
}

function vaciarCarrito() {
    carrito = [];
    actualizarCarritoUI();
}

// Registro / Login simulados
function renderHeaderBySession() {
    if (currentUser) {
        headerActions.innerHTML = `
            <span class="user-badge"><i class="fas fa-user-check"></i> Hola, ${currentUser.nombre}</span>
            <button id="logoutHeaderBtn" class="btn-outline"><i class="fas fa-sign-out-alt"></i> Cerrar sesión</button>
        `;
        document.getElementById('logoutHeaderBtn')?.addEventListener('click', () => {
            currentUser = null;
            renderHeaderBySession();
            actualizarDatosPanel();
            alert('Has cerrado sesión correctamente.');
            // Mostrar pestaña menú
            showTab('menu');
        });
    } else {
        headerActions.innerHTML = `
            <button id="showRegistroBtn" class="btn-outline"><i class="fas fa-user-plus"></i> Registrarse</button>
            <button id="showLoginBtn" class="btn-primary"><i class="fas fa-sign-in-alt"></i> Iniciar sesión</button>
        `;
        document.getElementById('showRegistroBtn')?.addEventListener('click', mostrarFormRegistro);
        document.getElementById('showLoginBtn')?.addEventListener('click', mostrarFormLogin);
    }
    actualizarDatosPanel();
}

function mostrarFormRegistro() {
    const nombreReg = prompt("Registro - Ingresa tu nombre completo:");
    if (!nombreReg) return;
    const emailReg = prompt("Correo electrónico:");
    if (!emailReg) return;
    const direccionReg = prompt("Dirección de entrega:");
    if (!direccionReg) return;
    currentUser = { nombre: nombreReg, email: emailReg, direccion: direccionReg };
    renderHeaderBySession();
    alert(`Bienvenido ${nombreReg}, ya puedes hacer pedidos.`);
    showTab('menu');
}
function mostrarFormLogin() {
    const nombreLogin = prompt("Iniciar sesión - Ingresa tu nombre (demo):");
    if (!nombreLogin) return;
    // Simulamos usuario existente
    currentUser = { nombre: nombreLogin, email: `${nombreLogin}@ejemplo.com`, direccion: "Calle Principal" };
    renderHeaderBySession();
    alert(`Sesión iniciada como ${nombreLogin}`);
    showTab('menu');
}

function actualizarDatosPanel() {
    if (!datosUsuarioInfo) return;
    if (currentUser) {
        datosUsuarioInfo.innerHTML = `
            <p><i class="fas fa-user"></i> <strong>Nombre:</strong> ${currentUser.nombre}</p>
            <p><i class="fas fa-envelope"></i> <strong>Correo:</strong> ${currentUser.email}</p>
            <p><i class="fas fa-map-marker-alt"></i> <strong>Dirección:</strong> ${currentUser.direccion}</p>
            <p><i class="fas fa-id-badge"></i> <strong>Cuenta activa:</strong> ${currentUser.nombre}</p>
        `;
        editNombre.value = currentUser.nombre;
        editEmail.value = currentUser.email;
        editDireccion.value = currentUser.direccion;
    } else {
        datosUsuarioInfo.innerHTML = `<p><i class="fas fa-exclamation-triangle"></i> No has iniciado sesión. Regístrate o inicia sesión para ver tus datos.</p>
        <p><strong>Correo electrónico:</strong> -- no registrado --</p>`;
        editNombre.value = '';
        editEmail.value = '';
        editDireccion.value = '';
    }
}

function actualizarDatosUsuario() {
    if (!currentUser) {
        alert("Debes iniciar sesión para actualizar datos.");
        return;
    }
    const newNombre = editNombre.value.trim();
    const newEmail = editEmail.value.trim();
    const newDir = editDireccion.value.trim();
    if (newNombre) currentUser.nombre = newNombre;
    if (newEmail) currentUser.email = newEmail;
    if (newDir) currentUser.direccion = newDir;
    renderHeaderBySession();
    actualizarDatosPanel();
    alert("Datos actualizados correctamente.");
}

// Proceso de pago
function realizarPago() {
    if (!currentUser) {
        paymentMsg.innerText = "Debes iniciar sesión para realizar el pedido.";
        return;
    }
    if (carrito.length === 0) {
        paymentMsg.innerText = "Carrito vacío. Agrega productos antes de pagar.";
        return;
    }
    const metodo = document.getElementById('metodoPago').value;
    const ref = document.getElementById('cardRef').value || "demo referencia";
    const total = carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
    // Simular éxito
    alert(`✅ Pedido realizado con éxito.\nMétodo: ${metodo}\nTotal: $${total.toFixed(2)} USD\nGracias ${currentUser.nombre}, tu pedido llegará a ${currentUser.direccion}.`);
    vaciarCarrito();
    paymentMsg.innerText = "Pago confirmado. ¡Disfruta tu comida!";
    setTimeout(() => paymentMsg.innerText = "", 3000);
    document.getElementById('cardRef').value = "";
}

// Cambiar cuenta (Cerrar sesión)
function cambiarCuenta() {
    if (currentUser) {
        currentUser = null;
        renderHeaderBySession();
        vaciarCarrito();
        alert("Cuenta cambiada / sesión cerrada. Puedes registrarte nuevamente.");
    } else {
        mostrarFormLogin();
    }
    showTab('menu');
}

// Tabs
function showTab(tabId) {
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active-pane'));
    document.getElementById(`${tabId}Pane`).classList.add('active-pane');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
}
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            if (tab) showTab(tab);
        });
    });
}

// Inicializar todos los datos
function init() {
    renderItems(menuGrid, menuData, null);
    renderItems(bebidasGrid, bebidasData, null);
    renderItems(promosGrid, promocionesData, null);
    actualizarCarritoUI();
    renderHeaderBySession();
    initTabs();
    actualizarDatosPanel();
    if (cambiarCuentaBtn) cambiarCuentaBtn.addEventListener('click', cambiarCuenta);
    if (vaciarCarritoBtn) vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    if (confirmarPagoBtn) confirmarPagoBtn.addEventListener('click', realizarPago);
    if (actualizarDatosBtn) actualizarDatosBtn.addEventListener('click', actualizarDatosUsuario);
    // por defecto mostrar menú
    showTab('menu');
}
init();