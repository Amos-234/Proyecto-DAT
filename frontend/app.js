// --- ESTADO GLOBAL ---
let productos = []; // Se rellenará dinámicamente desde MySQL
let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
    cargarProductosYArrancar();
    actualizarMenuNavegacion();
});

// --- 1. CARGA DE DATOS DESDE LA API ---
async function cargarProductosYArrancar() {
    try {
        const respuesta = await fetch('../backend/get_productos.php');
        if (!respuesta.ok) throw new Error('Error al conectar con la API');
        
        productos = await respuesta.json();
        iniciarEnrutador();
    } catch (error) {
        console.error("Error al cargar productos:", error);
        alert("No se pudo conectar con la base de datos local. Asegúrate de que XAMPP tiene Apache y MySQL encendidos.");
    }
}

// --- 2. ENRUTADOR DE LA SPA ---
function iniciarEnrutador() {
    const enrutador = () => {
        const hash = window.location.hash || "#home";
        
        const secciones = document.querySelectorAll("main > section");
        secciones.forEach(seccion => seccion.style.display = "none");

        const footer = document.getElementById("footer-principal");

        if (hash.startsWith("#producto/")) {
            document.getElementById("producto").style.display = "block";
            if (footer) footer.style.display = "none"; 
            const partes = hash.split("/");
            const productoId = parseInt(partes[1]); 
            renderizarDetalle(productoId);
            return; 
        }

        const seccionActiva = document.querySelector(hash);
        if (seccionActiva) {
            seccionActiva.style.display = "block";
        }

        if (hash === "#home" || hash === "") {
            if (footer) footer.style.display = "block"; 
            renderizarHome();
        } else {
            if (footer) footer.style.display = "none";  
        }

        if (hash === "#catalogo") renderizarCatalogo();
        if (hash === "#login") renderizarLogin();
        if (hash === "#carrito") renderizarCarrito();
        if (hash === "#cuenta") renderizarCuenta(); 
    };

    window.addEventListener("hashchange", enrutador);
    enrutador();
}

// --- 3. COMPONENTES VISUALES Y RENDERIZADO ---
function generarTarjetaProducto(prod, esCarrusel = false) {
    let etiquetaOferta = '';
    let uiPrecio = `<span class="fs-5 fw-bold text-primary">${parseFloat(prod.precio).toFixed(2)} €</span>`;

    if (prod.precioOriginal && prod.precioOriginal > prod.precio) {
        const porcentajeDescuento = Math.round(((prod.precioOriginal - prod.precio) / prod.precioOriginal) * 100);
        etiquetaOferta = `<span class="badge bg-danger position-absolute top-0 start-0 m-2">-${porcentajeDescuento}% Dto.</span>`;
        uiPrecio = `<span class="text-muted text-decoration-line-through small me-2">${parseFloat(prod.precioOriginal).toFixed(2)} €</span><span class="fs-5 fw-bold text-danger">${parseFloat(prod.precio).toFixed(2)} €</span>`;
    }

    const anchoEstilo = esCarrusel ? 'style="min-width: 280px; max-width: 280px;"' : '';

    return `
        <div class="card h-100 shadow-sm border-0 bg-light" ${anchoEstilo}>
            ${etiquetaOferta}
            <img src="${prod.imagen}" class="card-img-top p-2 rounded img-tarjeta-producto" alt="${prod.nombre}">
            <div class="card-body d-flex flex-column">
                <div class="mb-2">
                    <span class="badge bg-secondary">${prod.marca}</span>
                    <span class="badge bg-info text-dark">${prod.categoria}</span>
                </div>
                <h5 class="card-title fs-6 fw-bold titulo-producto">${prod.nombre}</h5>
                <p class="card-text text-muted small mb-3 flex-grow-1">${prod.descripcion.substring(0, 60)}...</p>
                <div class="d-flex justify-content-between align-items-center mt-auto">
                    <div>${uiPrecio}</div>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-success" onclick="agregarAlCarrito(${prod.id})" title="Añadir al carrito">
                            <i class="bi bi-cart-plus"></i>
                        </button>
                        <a href="#producto/${prod.id}" class="btn btn-sm btn-primary">Ver</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderizarHome() {
    const destacados = productos.slice(0, 6);
    document.getElementById("trackDestacados").innerHTML = destacados.map(p => generarTarjetaProducto(p, true)).join('');

    const novedades = productos.slice(6, 12);
    document.getElementById("trackNovedades").innerHTML = novedades.map(p => generarTarjetaProducto(p, true)).join('');

    const ofertas = productos.filter(p => p.precioOriginal && p.precioOriginal > p.precio).slice(0, 8);
    document.getElementById("trackOfertas").innerHTML = ofertas.map(p => generarTarjetaProducto(p, true)).join('');
}

function renderizarCatalogo(filtro = "Todos") {
    const contenedorCatalogo = document.getElementById("catalogo");
    const categoriasIneditas = ["Todos", ...new Set(productos.map(p => p.categoria))];

    let botonesFiltroHTML = categoriasIneditas.map(cat => `
        <button class="btn ${filtro === cat ? 'btn-primary' : 'btn-outline-primary'} mb-2 me-2" 
                onclick="renderizarCatalogo('${cat}')">${cat}</button>
    `).join('');

    contenedorCatalogo.innerHTML = `
        <div class="container py-5">
            <h2 class="mb-4 fw-bold">Catálogo de Componentes</h2>
            <div class="d-flex flex-wrap mb-4 pb-3 border-bottom">${botonesFiltroHTML}</div>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4" id="grid-productos"></div>
        </div>
    `;

    const grid = document.getElementById("grid-productos");
    const productosFiltrados = filtro === "Todos" ? productos : productos.filter(prod => prod.categoria === filtro);

    if (productosFiltrados.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted fs-5">No hay productos en esta categoría.</p></div>`;
        return;
    }

    grid.innerHTML = productosFiltrados.map(p => `<div class="col">${generarTarjetaProducto(p, false)}</div>`).join('');
}

// --- 4. LÓGICA DE BÚSQUEDA AVANZADA ---
function mostrarSugerencias(texto) {
    const caja = document.getElementById("cajaSugerencias");
    if (!texto || texto.trim().length === 0) {
        caja.innerHTML = "";
        caja.classList.add("d-none");
        return;
    }

    const termino = texto.toLowerCase().trim();
    const resultados = productos.filter(prod => 
        prod.nombre.toLowerCase().includes(termino) || 
        prod.categoria.toLowerCase().includes(termino) ||
        prod.marca.toLowerCase().includes(termino)
    );

    if (resultados.length === 0) {
        caja.innerHTML = `<div class="p-3 text-muted text-center">No se encontraron productos para "${texto}"</div>`;
        caja.classList.remove("d-none");
        return;
    }

    const htmlSugerencias = resultados.map(prod => `
        <a href="#producto/${prod.id}" class="text-decoration-none text-dark d-flex align-items-center p-2 border-bottom result-hover" onclick="ocultarSugerencias()">
            <img src="${prod.imagen}" style="width: 50px; height: 50px; object-fit: contain;" class="me-3 rounded bg-light">
            <div class="flex-grow-1 overflow-hidden">
                <div class="fw-bold fs-6 text-truncate">${prod.nombre}</div>
                <div class="small text-muted">${prod.categoria}</div>
            </div>
            <div class="fw-bold text-primary ms-2">${parseFloat(prod.precio).toFixed(2)}€</div>
        </a>
    `).join('');

    caja.innerHTML = htmlSugerencias;
    caja.classList.remove("d-none");
}

function ocultarSugerencias() {
    const caja = document.getElementById("cajaSugerencias");
    if(caja) caja.classList.add("d-none");
}

document.addEventListener("click", (evento) => {
    const contenedor = document.getElementById("contenedorBusqueda");
    if (contenedor && !contenedor.contains(evento.target)) {
        ocultarSugerencias();
    }
});

function realizarBusqueda(event) {
    event.preventDefault(); 
    const input = document.getElementById("inputBusqueda");
    const texto = input.value.toLowerCase().trim();
    
    ocultarSugerencias();
    window.location.hash = "#catalogo"; 

    setTimeout(() => {
        if(texto !== "") {
            const contenedorCatalogo = document.getElementById("catalogo");
            const resultados = productos.filter(prod => 
                prod.nombre.toLowerCase().includes(texto) || 
                prod.categoria.toLowerCase().includes(texto) ||
                prod.marca.toLowerCase().includes(texto)
            );
            
            contenedorCatalogo.innerHTML = `
                <div class="container py-5">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2 class="fw-bold m-0">Resultados para: "${texto}"</h2>
                        <button class="btn btn-outline-secondary" onclick="document.getElementById('inputBusqueda').value=''; renderizarCatalogo('Todos');">Limpiar Filtro</button>
                    </div>
                    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4" id="grid-busqueda"></div>
                </div>
            `;
            
            const grid = document.getElementById("grid-busqueda");
            if(resultados.length === 0) {
                grid.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted fs-5">No hemos encontrado resultados. Intenta con otra palabra.</p></div>`;
            } else {
                grid.innerHTML = resultados.map(p => `<div class="col">${generarTarjetaProducto(p, false)}</div>`).join('');
            }
        }
    }, 50);
}

// --- 5. VISTA DE DETALLE DE PRODUCTO ---
function renderizarDetalle(id) {
    const prod = productos.find(p => p.id === id);
    const contenedorProducto = document.getElementById("producto");
    
    if (!prod) {
        contenedorProducto.innerHTML = `<div class="container py-5"><h2>Producto no encontrado</h2></div>`;
        return;
    }

    let uiPrecioGrande = `<span class="fs-2 text-primary fw-bold">${parseFloat(prod.precio).toFixed(2)} €</span>`;
    let badgeOfertaDetalle = '';

    if (prod.precioOriginal && prod.precioOriginal > prod.precio) {
        const porcentajeDescuento = Math.round(((prod.precioOriginal - prod.precio) / prod.precioOriginal) * 100);
        uiPrecioGrande = `<span class="text-muted text-decoration-line-through fs-4 me-3">${parseFloat(prod.precioOriginal).toFixed(2)} €</span><span class="fs-2 fw-bold text-danger">${parseFloat(prod.precio).toFixed(2)} €</span>`;
        badgeOfertaDetalle = `<span class="badge bg-danger mb-2 ms-2">¡-${porcentajeDescuento}% de Descuento!</span>`;
    }

    const textoTweet = encodeURIComponent(`¡Mira este increíble ${prod.nombre} por solo ${parseFloat(prod.precio).toFixed(2)}€ en Telecom! 🚀`);
    const urlActual = encodeURIComponent(window.location.href);

    contenedorProducto.innerHTML = `
        <div class="container py-5">
            <button class="btn btn-link text-decoration-none mb-4 text-dark" onclick="window.history.back()">
                <i class="bi bi-arrow-left"></i> Volver
            </button>
            <div class="row">
                <div class="col-md-6 mb-4">
                    <img src="${prod.imagen}" class="img-fluid rounded shadow-sm w-100" alt="${prod.nombre}">
                </div>
                <div class="col-md-6">
                    <span class="badge bg-secondary mb-2">${prod.marca}</span>
                    <span class="badge bg-info text-dark mb-2">${prod.categoria}</span>
                    ${badgeOfertaDetalle}
                    <h2 class="fw-bold">${prod.nombre}</h2>
                    <div class="mb-4 mt-2">${uiPrecioGrande}</div>
                    <p class="text-muted mb-4">${prod.descripcion}</p>
                    
                    <div class="d-grid gap-2 mb-5">
                        <button class="btn btn-success btn-lg" onclick="agregarAlCarrito(${prod.id})">
                            <i class="bi bi-cart-plus"></i> Añadir al Carrito
                        </button>
                    </div>

                    <div class="mt-4 pt-4 border-top">
                        <p class="fw-bold mb-3"><i class="bi bi-share"></i> Compartir este producto:</p>
                        <a href="https://twitter.com/intent/tweet?text=${textoTweet}&url=${urlActual}" target="_blank" class="btn btn-outline-info btn-sm me-2 mb-2">
                            <i class="bi bi-twitter-x"></i> Twittear
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// --- FUNCIONES AUXILIARES UI (Ver contraseña y Formatear inputs) ---
function togglePass(id, mostrar) {
    const input = document.getElementById(id);
    if (input) input.type = mostrar ? "text" : "password";
}

function formatearTarjeta(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{4})(?=\d)/g, '$1-'); // Añade el guion cada 4 números
    input.value = valor;
}

function formatearFecha(input) {
    // Limpiar: solo permitimos números
    let valor = input.value.replace(/\D/g, ''); 

    // Limitar a 4 dígitos (MMYY)
    if (valor.length > 4) valor = valor.substring(0, 4);

    // Lógica estricta de Mes (01-12)
    if (valor.length >= 2) {
        let mes = parseInt(valor.substring(0, 2));
        
        // Si el usuario escribe 0, lo dejamos esperar. Si escribe > 12, lo ajustamos a 12. Si es 00, a 01.
        if (mes > 12) mes = 12;
        if (mes === 0) mes = 1; 
        valor = mes.toString().padStart(2, '0') + valor.substring(2);
    }

    // 4. Aplicar formato visual (MM/YY)
    if (valor.length > 2) {
        input.value = valor.substring(0, 2) + '/' + valor.substring(2, 4);
    } else {
        input.value = valor;
    }
}

function formatearCVV(input) {
    input.value = input.value.replace(/\D/g, ''); // Solo números
}

// --- 6. FORMULARIOS DE AUTENTICACIÓN (LOGIN Y REGISTRO) ---
function renderizarLogin() {
    const contenedorLogin = document.getElementById("login");
    
    contenedorLogin.innerHTML = `
        <div class="container py-5">
            <h2 class="text-center mb-5 fw-bold">Área Personal</h2>
            <div class="row justify-content-center g-4">
                
                <div class="col-md-5">
                    <div class="card shadow-sm h-100 border-0">
                        <div class="card-body p-4">
                            <h4 class="card-title mb-4">Ya tengo cuenta</h4>
                            <form onsubmit="iniciarSesion(event)">
                                <div class="mb-3">
                                    <label class="form-label text-muted small">Correo electrónico</label>
                                    <input type="email" id="login-email" class="form-control" placeholder="ejemplo@correo.com" required>
                                </div>
                                <div class="mb-4">
                                    <label class="form-label text-muted small">Contraseña</label>
                                    <div class="input-group">
                                        <input type="password" id="login-password" class="form-control" placeholder="••••••••" required>
                                        <button class="btn btn-outline-secondary" type="button" 
                                            onmousedown="togglePass('login-password', true)" 
                                            onmouseup="togglePass('login-password', false)" 
                                            onmouseleave="togglePass('login-password', false)"
                                            ontouchstart="togglePass('login-password', true)"
                                            ontouchend="togglePass('login-password', false)">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary w-100 mb-4">Entrar</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="col-md-5">
                    <div class="card shadow-sm h-100 bg-light border-0">
                        <div class="card-body p-4">
                            <h4 class="card-title mb-4">Crear una cuenta nueva</h4>
                            <p class="text-muted small mb-4">Regístrate para poder gestionar el estado de tus pedidos y revisar tu histórico.</p>
                            
                            <form onsubmit="registrarUsuario(event)">
                                <div class="mb-3">
                                    <label class="form-label text-muted small">Nombre completo</label>
                                    <input type="text" id="reg-nombre" class="form-control" placeholder="Nombre completo" minlength="3" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-muted small">Correo electrónico</label>
                                    <input type="email" id="reg-email" class="form-control" placeholder="ejemplo@correo.com" required>
                                </div>
                                <div class="mb-4">
                                    <label class="form-label text-muted small">Contraseña</label>
                                    <div class="input-group">
                                        <input type="password" id="reg-password" class="form-control" placeholder="Crea una contraseña segura" 
                                            pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}" 
                                            title="Debe contener al menos 8 caracteres, un número, una mayúscula, una minúscula y un símbolo especial (!@#$%^&*)" 
                                            required>
                                        <button class="btn btn-outline-secondary" type="button" 
                                            onmousedown="togglePass('reg-password', true)" 
                                            onmouseup="togglePass('reg-password', false)" 
                                            onmouseleave="togglePass('reg-password', false)"
                                            ontouchstart="togglePass('reg-password', true)"
                                            ontouchend="togglePass('reg-password', false)">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-success w-100">Registrarse</button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;
}

// --- 7. GESTIÓN ASÍNCRONA DE USUARIOS ---
function actualizarMenuNavegacion() {
    const contenedor = document.getElementById('contenedor-auth-nav');
    if (!contenedor) return;

    const usuarioSession = localStorage.getItem('usuarioTelecom');

    if (usuarioSession) {
        const usuario = JSON.parse(usuarioSession);
        contenedor.innerHTML = `
            <div class="nav-item dropdown">
                <a class="nav-link dropdown-toggle fw-semibold text-primary mx-2" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-person-check-fill"></i> ${usuario.nombre.split(' ')[0]}
                </a>
                <ul class="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="#cuenta"><i class="bi bi-box-seam me-2"></i> Mis Pedidos</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><button class="dropdown-item text-danger small fw-semibold" onclick="cerrarSesion()"><i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión</button></li>
                </ul>
            </div>
        `;
    } else {
        contenedor.innerHTML = `
            <a href="#login" class="nav-link fw-semibold mx-2"><i class="bi bi-person-circle"></i> Login</a>
        `;
    }
}

function cerrarSesion() {
    localStorage.removeItem('usuarioTelecom');
    alert("Has cerrado sesión correctamente.");
    actualizarMenuNavegacion();
    window.location.hash = "#home";
}

async function registrarUsuario(event) {
    event.preventDefault();

    const nombre = document.getElementById('reg-nombre').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const respuesta = await fetch('../backend/registro.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password })
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            alert("¡Registro exitoso! Ya puedes iniciar sesión en la columna izquierda.");
            event.target.reset(); 
        } else {
            alert("Error: " + resultado.error);
        }
    } catch (error) {
        console.error("Error al registrar:", error);
        alert("Ocurrió un error al intentar conectar con el servidor.");
    }
}

async function iniciarSesion(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const respuesta = await fetch('../backend/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            localStorage.setItem('usuarioTelecom', JSON.stringify(resultado.usuario));
            actualizarMenuNavegacion();
            alert(`¡Bienvenido de nuevo, ${resultado.usuario.nombre}!`);
            window.location.hash = "#catalogo";
        } else {
            alert("Error de autenticación: " + resultado.error);
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Ocurrió un error de conexión con el servidor local.");
    }
}

// --- 8. LÓGICA E INTERFAZ DEL CARRITO DE LA COMPRA ---
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        const itemExistente = carrito.find(item => item.id === id);
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        alert(`Se ha añadido "${producto.nombre}" al carrito.`);
    }
}

function cambiarCantidad(id, nuevaCantidad) {
    const cantidad = parseInt(nuevaCantidad);
    if (isNaN(cantidad) || cantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }
    const item = carrito.find(p => p.id === id);
    if (item) {
        item.cantidad = cantidad;
        renderizarCarrito(); 
    }
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    renderizarCarrito(); 
}

function renderizarCarrito() {
    const contenedorCarrito = document.getElementById("carrito");

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `
            <div class="container py-5 text-center">
                <i class="bi bi-cart-x text-muted" style="font-size: 4rem;"></i>
                <h2 class="mt-3 mb-4">Tu carrito está vacío</h2>
                <a href="#catalogo" class="btn btn-primary">Ir al Catálogo</a>
            </div>
        `;
        return;
    }

    const subtotal = carrito.reduce((acc, item) => acc + (parseFloat(item.precio) * item.cantidad), 0);
    const impuestos = subtotal * 0.21;
    const total = subtotal + impuestos;

    let filasHTML = "";
    carrito.forEach(item => {
        filasHTML += `
            <tr>
                <td class="ps-4 py-3">
                    <div class="d-flex align-items-center">
                        <img src="${item.imagen}" class="rounded me-3" alt="${item.nombre}" style="width: 60px; height: 40px; object-fit: cover;">
                        <div>
                            <h6 class="mb-0">${item.nombre}</h6>
                            <small class="text-muted">${item.marca}</small>
                        </div>
                    </div>
                </td>
                <td class="text-center" style="width: 150px;">
                    <div class="input-group input-group-sm mx-auto" style="width: 110px;">
                        <button class="btn btn-outline-secondary" type="button" onclick="cambiarCantidad(${item.id}, ${item.cantidad - 1})">-</button>
                        <input type="number" class="form-control text-center bg-white text-dark" value="${item.cantidad}" onchange="cambiarCantidad(${item.id}, this.value)" min="1">
                        <button class="btn btn-outline-secondary" type="button" onclick="cambiarCantidad(${item.id}, ${item.cantidad + 1})">+</button>
                    </div>
                </td>
                <td class="text-end fw-semibold">${(parseFloat(item.precio) * item.cantidad).toFixed(2)} €</td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${item.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    contenedorCarrito.innerHTML = `
        <div class="container py-5">
            <h2 class="mb-4 fw-bold">Tu Carrito de la Compra</h2>
            <div class="row g-4">
                <div class="col-lg-8">
                    <div class="card shadow-sm border-0">
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="table-light">
                                        <tr>
                                            <th scope="col" class="ps-4">Componente</th>
                                            <th scope="col" class="text-center">Cantidad</th>
                                            <th scope="col" class="text-end">Precio</th>
                                            <th scope="col" class="text-end pe-4">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${filasHTML}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card shadow-sm border-0 bg-light">
                        <div class="card-body p-4">
                            <h5 class="card-title mb-4">Resumen del pedido</h5>
                            
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Subtotal</span>
                                <span>${subtotal.toFixed(2)} €</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Envío estándar</span>
                                <span class="text-success">Gratis</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted">Impuestos (IVA 21%)</span>
                                <span>${impuestos.toFixed(2)} €</span>
                            </div>
                            
                            <hr class="my-4">
                            
                            <div class="d-flex justify-content-between mb-4">
                                <span class="fs-5 fw-bold">Total</span>
                                <span class="fs-5 fw-bold text-primary">${total.toFixed(2)} €</span>
                            </div>

                            <div class="mb-4">
                                <label class="form-label text-muted small">Método de pago</label>
                                <select id="metodo-pago" class="form-select border-secondary" onchange="mostrarCamposPago()">
                                    <option value="VISA">💳 VISA</option>
                                    <option value="Mastercard">💳 Mastercard</option>
                                    <option value="PayPal">🅿️ PayPal</option>
                                </select>
                            </div>
                            
                            <div id="campos-pago" class="mb-4"></div>
                            
                            <button class="btn btn-success w-100 btn-lg mb-3" onclick="procesarPago()">
                                <i class="bi bi-credit-card me-2"></i> Realizar Pago
                            </button>
                            <a href="#catalogo" class="btn btn-outline-secondary w-100">
                                Seguir comprando
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    mostrarCamposPago();
}

// --- 9. FUNCIONES DE VALIDACIÓN DE PAGO ---
function mostrarCamposPago() {
    const metodo = document.getElementById("metodo-pago").value;
    const contenedor = document.getElementById("campos-pago");
    if (!contenedor) return;

    if (metodo === "PayPal") {
        contenedor.innerHTML = `
            <input type="email" id="pago-paypal-email" class="form-control" placeholder="Correo de PayPal" required>
        `;
    } else {
        contenedor.innerHTML = `
            <input type="text" id="pago-card-num" class="form-control mb-2" placeholder="Número de tarjeta (16 dígitos)" maxlength="19" oninput="formatearTarjeta(this)" required>
            <div class="row g-2">
                <div class="col-6">
                    <input type="text" id="pago-card-date" class="form-control" placeholder="MM/YY" maxlength="5" oninput="formatearFecha(this)" required>
                </div>
                <div class="col-6">
                    <input type="text" id="pago-card-cvv" class="form-control" placeholder="CVV" maxlength="3" oninput="formatearCVV(this)" required>
                </div>
            </div>
        `;
    }
}

function validarPago(metodo) {
    if (metodo === "PayPal") {
        const input = document.getElementById("pago-paypal-email");
        return input ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value) : false;
    } else {
        const numInput = document.getElementById("pago-card-num");
        const cvvInput = document.getElementById("pago-card-cvv");
        const dateInput = document.getElementById("pago-card-date");
        
        if (!numInput || !cvvInput || !dateInput) return false;

        const num = numInput.value.replace(/-/g, ''); // Quitamos guiones para validar
        const cvv = cvvInput.value;
        const date = dateInput.value;

        // Validación: 16 números, 3 CVV, y mes 01-12 con año YY
        const numValido = /^\d{16}$/.test(num);
        const cvvValido = /^\d{3}$/.test(cvv);
        const dateValido = /^(0[1-9]|1[0-2])\/\d{2}$/.test(date);

        return numValido && cvvValido && dateValido;
    }
}

async function procesarPago() {
    if (carrito.length === 0) return alert("El carrito está vacío.");

    const metodoPago = document.getElementById("metodo-pago").value;
    
    // 1. Validamos los campos dinámicos
    if (!validarPago(metodoPago)) {
        alert("Por favor, introduce datos de pago válidos (Ej: 16 dígitos para tarjetas o un email válido para PayPal).");
        return;
    }

    const usuarioSession = localStorage.getItem('usuarioTelecom');
    const total = carrito.reduce((acc, i) => acc + (parseFloat(i.precio) * i.cantidad), 0) * 1.21;

    // 2. Función visual de agradecimiento
    const mostrarGracias = () => {
        document.querySelector("main").innerHTML = `
            <div class="container py-5 text-center" style="min-height: 50vh; margin-top: 10vh;">
                <div class="display-1 text-success mb-3"><i class="bi bi-check-circle-fill"></i></div>
                <h2 class="fw-bold">¡Muchas gracias por tu compra!</h2>
                <p class="text-muted fs-5 mt-3">Hemos procesado tu pago correctamente mediante ${metodoPago}.</p>
                <p class="small">Serás redirigido automáticamente enseguida...</p>
                <div class="spinner-border text-success mt-3" role="status" style="width: 2rem; height: 2rem;"></div>
            </div>
        `;
        // Redirigir al inicio o a cuenta tras 4 segundos
        setTimeout(() => { 
            window.location.hash = usuarioSession ? "#cuenta" : "#home"; 
            location.reload(); 
        }, 4000);
    };

    // 3. Lógica según el usuario (Invitado vs Logueado)
    if (!usuarioSession) {
        carrito = [];
        mostrarGracias();
        return;
    }

    const usuario = JSON.parse(usuarioSession);
    try {
        const respuesta = await fetch('../backend/guardar_pedido.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuario.id, total: total, carrito: carrito })
        });

        if (respuesta.ok) {
            carrito = [];
            mostrarGracias();
        } else {
            const res = await respuesta.json();
            alert("Error al guardar: " + res.error);
        }
    } catch (e) {
        alert("Fallo de conexión al intentar guardar tu pedido.");
    }
}

// --- 10. HISTORIAL DE PEDIDOS ---
async function renderizarCuenta() {
    const contenedor = document.getElementById("cuenta");
    const usuarioSession = localStorage.getItem('usuarioTelecom');
    
    if (!usuarioSession) {
        window.location.hash = "#login";
        return;
    }

    const usuario = JSON.parse(usuarioSession);
    contenedor.innerHTML = `<div class="container py-5 text-center"><div class="spinner-border text-primary" role="status"></div><h4 class="mt-3">Cargando tus pedidos...</h4></div>`;

    try {
        const respuesta = await fetch('../backend/obtener_pedidos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuario.id })
        });

        const pedidos = await respuesta.json();

        if (pedidos.length === 0) {
            contenedor.innerHTML = `
                <div class="container py-5 text-center">
                    <i class="bi bi-box-seam text-muted" style="font-size: 4rem;"></i>
                    <h2 class="mt-3 mb-4">Aún no has realizado ningún pedido</h2>
                    <a href="#catalogo" class="btn btn-primary">Ir al Catálogo</a>
                </div>
            `;
            return;
        }

        let pedidosHTML = pedidos.map(pedido => `
            <div class="card shadow-sm mb-4 border-0">
                <div class="card-header bg-light d-flex justify-content-between align-items-center py-3">
                    <div>
                        <span class="text-muted small">Pedido #${pedido.id}</span><br>
                        <span class="fw-bold"><i class="bi bi-calendar-check me-1"></i> ${new Date(pedido.fecha_pedido).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div class="text-end">
                        <span class="badge bg-success mb-1">${pedido.estado}</span><br>
                        <span class="fw-bold text-primary fs-5">${parseFloat(pedido.total).toFixed(2)} €</span>
                    </div>
                </div>
                <div class="card-body p-0">
                    <ul class="list-group list-group-flush">
                        ${pedido.detalles.map(det => `
                            <li class="list-group-item d-flex align-items-center p-3 border-light">
                                <img src="${det.imagen}" class="rounded me-3 shadow-sm" style="width: 60px; height: 60px; object-fit: contain;">
                                <div class="flex-grow-1">
                                    <h6 class="mb-0 fw-semibold">${det.nombre}</h6>
                                    <small class="text-muted">${det.cantidad} uds. x ${parseFloat(det.precio_unitario).toFixed(2)} €</small>
                                </div>
                                <div class="fw-bold">
                                    ${(det.cantidad * parseFloat(det.precio_unitario)).toFixed(2)} €
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `).join('');

        contenedor.innerHTML = `
            <div class="container py-5">
                <h2 class="mb-4 fw-bold">Historial de Mis Pedidos</h2>
                <div class="row">
                    <div class="col-lg-9 mx-auto">
                        ${pedidosHTML}
                    </div>
                </div>
            </div>
        `;

    } catch (error) {
        contenedor.innerHTML = `<div class="container py-5"><div class="alert alert-danger shadow-sm">No se pudieron cargar tus pedidos en este momento.</div></div>`;
    }
}