// --- ESTADO GLOBAL ---
let productos = []; // Se rellenará dinámicamente desde MySQL
let carrito = [];
let adminPedidosGlobal = [];   // NUEVO: Para el buscador de pedidos
let adminProductosGlobal = []; // NUEVO: Para el buscador de productos
let idAdminActivo = null;      // NUEVO: Guarda el ID del administrador

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
        
        // Si ya hay sesión, recuperamos sus favoritos
        const usuarioSession = localStorage.getItem('usuarioTelecom');
        if (usuarioSession) await cargarWishlist(JSON.parse(usuarioSession).id);

        iniciarEnrutador();
    } catch (error) {
        console.error("Error al cargar productos:", error);
        alert("No se pudo conectar con la base de datos local.");
    }
}

// --- 2. ENRUTADOR DE LA SPA ---
function iniciarEnrutador() {
    const enrutador = () => {
        const hash = window.location.hash || "#home";

        window.scrollTo({ top: 0 });
        
        // Guardia de acceso admin (antes de cualquier renderizado)
        if (hash === "#admin") {
            const usuarioSession = localStorage.getItem('usuarioTelecom');
            const usuario = usuarioSession ? JSON.parse(usuarioSession) : null;
            if (!usuario || usuario.rol !== 'admin') {
                alert("Acceso denegado. No eres administrador.");
                window.location.hash = "#home";
                return;
            }
        }

        // Guardia para rutas que requieren login
        if (hash === "#perfil" || hash === "#cuenta" || hash === "#wishlist") {
            if (!localStorage.getItem('usuarioTelecom')) {
                window.location.hash = "#login";
                return;
            }
        }

        // Ocultar todas las secciones
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
        if (hash === "#admin") renderizarAdmin();
        if (hash === "#perfil") renderizarPerfil();
        if (hash === "#wishlist") renderizarWishlist();
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

    let botonCarrito = prod.stock > 0 
        ? `<button class="btn btn-sm btn-success" onclick="agregarAlCarrito(${prod.id})" title="Añadir al carrito"><i class="bi bi-cart-plus"></i></button>` 
        : `<button class="btn btn-sm btn-secondary" disabled title="Sin existencias">X</button>`;

    // NUEVO: Botón de Favoritos (Solo si hay sesión)
    const enWishlist = wishlist.includes(prod.id);
    const corazon = localStorage.getItem('usuarioTelecom') 
        ? `<button class="btn btn-sm ${enWishlist ? 'btn-danger' : 'btn-light border'} position-absolute top-0 end-0 m-2 rounded-circle shadow-sm" onclick="toggleWishlist(${prod.id})" style="z-index:10;"><i class="bi ${enWishlist ? 'bi-heart-fill' : 'bi-heart text-danger'}"></i></button>` 
        : '';

    const anchoEstilo = esCarrusel ? 'style="min-width: 280px; max-width: 280px;"' : '';

    return `
        <div class="card h-100 shadow-sm border-0 bg-light position-relative" ${anchoEstilo}>
            ${etiquetaOferta}
            ${corazon}
            <img src="${prod.imagen}" class="card-img-top p-2 rounded img-tarjeta-producto" alt="${prod.nombre}">
            <div class="card-body d-flex flex-column">
                <div class="mb-2">
                    <span class="badge bg-secondary">${prod.marca}</span>
                    <span class="badge bg-info text-dark">${prod.categoria}</span>
                </div>
                <h5 class="card-title fs-6 fw-bold titulo-producto">${prod.nombre}</h5>
                <p class="card-text text-muted small mb-3 flex-grow-1">${prod.descripcion.substring(0, 60)}...</p>
                <div class="d-flex justify-content-between align-items-center mt-auto">
                    <div>
                        ${uiPrecio}
                        <br><small class="text-muted">Stock: ${prod.stock}</small>
                    </div>
                    <div class="btn-group">
                        ${botonCarrito}
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
    // 1. Subir arriba del todo al cargar un nuevo producto
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const prod = productos.find(p => p.id === id);
    const contenedorProducto = document.getElementById("producto");
    
    if (!prod) {
        contenedorProducto.innerHTML = `<div class="container py-5"><h2>Producto no encontrado</h2></div>`;
        return;
    }

    // --- CONFIGURACIÓN DE PRECIOS Y OFERTAS ---
    let uiPrecioGrande = `<span class="fs-2 text-primary fw-bold">${parseFloat(prod.precio).toFixed(2)} €</span>`;
    let badgeOfertaDetalle = '';

    if (prod.precioOriginal && prod.precioOriginal > prod.precio) {
        const porcentajeDescuento = Math.round(((prod.precioOriginal - prod.precio) / prod.precioOriginal) * 100);
        uiPrecioGrande = `<span class="text-muted text-decoration-line-through fs-4 me-3">${parseFloat(prod.precioOriginal).toFixed(2)} €</span><span class="fs-2 fw-bold text-danger">${parseFloat(prod.precio).toFixed(2)} €</span>`;
        badgeOfertaDetalle = `<span class="badge bg-danger mb-2 ms-2">¡-${porcentajeDescuento}% Dto!</span>`;
    }

    const textoTweet = encodeURIComponent(`¡Mira este increíble ${prod.nombre} por solo ${parseFloat(prod.precio).toFixed(2)}€ en Telecom! 🚀`);
    const urlActual = encodeURIComponent(window.location.href);

    // --- LÓGICA: PRODUCTOS SIMILARES (Misma Categoría) ---
    const similares = productos
        .filter(p => p.categoria === prod.categoria && p.id !== prod.id)
        .slice(0, 4);

    let htmlSimilares = '';
    if (similares.length > 0) {
        htmlSimilares = `
            <div class="mt-5 pt-5 border-top">
                <h3 class="fw-bold mb-4">Productos de la misma categoría</h3>
                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                    ${similares.map(p => `<div class="col">${generarTarjetaProducto(p, false)}</div>`).join('')}
                </div>
            </div>
        `;
    }

    // --- LÓGICA: PRODUCTOS RECOMENDADOS (Aleatorios cruzados) ---
    const recomendados = productos
        .filter(p => p.id !== prod.id && !similares.find(s => s.id === p.id))
        .sort(() => 0.5 - Math.random()) 
        .slice(0, 4);

    let htmlRecomendados = '';
    if (recomendados.length > 0) {
        htmlRecomendados = `
            <div class="mt-5 pt-5 border-top">
                <h3 class="fw-bold mb-4">También te podría interesar</h3>
                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                    ${recomendados.map(p => `<div class="col">${generarTarjetaProducto(p, false)}</div>`).join('')}
                </div>
            </div>
        `;
    }

    // --- SEGURIDAD ---
    const descripcionLarga = prod.descripcion_detallada || prod.descripcion;

    // --- RENDERIZADO VISUAL DEL DOM ---
    contenedorProducto.innerHTML = `
        <div class="container py-5">
            
            <button class="btn btn-link text-decoration-none mb-4 text-dark p-0" onclick="window.history.back()">
                <i class="bi bi-arrow-left"></i> Volver atrás
            </button>

            <div class="row mb-5 align-items-center">
                <div class="col-md-6 mb-4 mb-md-0 text-center">
                    <div class="bg-white rounded shadow-sm p-4">
                        <img src="${prod.imagen}" class="img-fluid" alt="${prod.nombre}" style="max-height: 350px; object-fit: contain; width: 100%;">
                    </div>
                </div>
                <div class="col-md-6 ps-md-5">
                    <span class="badge bg-secondary mb-2">${prod.marca}</span>
                    <span class="badge bg-info text-dark mb-2">${prod.categoria}</span>
                    ${badgeOfertaDetalle}
                    
                    <h1 class="fw-bold fs-2 mt-2 mb-3">${prod.nombre}</h1>
                    <div class="mb-4">${uiPrecioGrande}</div>
                    
                    <p class="text-muted fs-5 mb-4">
                        ${prod.descripcion.length > 120 ? prod.descripcion.substring(0, 120) + '...' : prod.descripcion}
                    </p>
                    
                    <div class="d-flex align-items-center gap-4 mb-4 pb-3 border-bottom">
                        <span class="text-muted"><i class="bi bi-box-seam me-2"></i>Stock: <span class="fw-bold ${prod.stock > 0 ? 'text-dark' : 'text-danger'}">${prod.stock}</span></span>
                        <span class="text-success fw-semibold"><i class="bi bi-truck me-2"></i>Envío en 24/48h</span>
                    </div>

                    <div class="d-flex gap-2 mb-4">
                        <button class="btn btn-success btn-lg shadow-sm flex-grow-1" onclick="agregarAlCarrito(${prod.id})" ${prod.stock === 0 ? 'disabled' : ''}>
                            <i class="bi bi-cart-plus me-2"></i> ${prod.stock === 0 ? 'Agotado' : 'Añadir al Carrito'}
                        </button>
                        ${localStorage.getItem('usuarioTelecom') ? `
                        <button class="btn ${wishlist.includes(prod.id) ? 'btn-danger' : 'btn-outline-danger'} btn-lg shadow-sm px-4" onclick="toggleWishlist(${prod.id})" title="Lista de Deseos">
                            <i class="bi ${wishlist.includes(prod.id) ? 'bi-heart-fill' : 'bi-heart'}"></i>
                        </button>` : ''}
                    </div>
                        <span class="fw-bold small me-2"><i class="bi bi-share"></i> Compartir:</span>
                        <a href="https://twitter.com/intent/tweet?text=${textoTweet}&url=${urlActual}" target="_blank" class="btn btn-outline-info btn-sm">
                            <i class="bi bi-twitter-x"></i> Twittear
                        </a>
                    </div>
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-12">
                    <div class="card border-0 shadow-sm bg-light">
                        <div class="card-body p-4 p-md-5">
                            <h4 class="fw-bold mb-4">Descripción Detallada</h4>
                            <p class="text-muted lh-lg mb-5" style="font-size: 1.1rem; white-space: pre-line;">
                                ${descripcionLarga}
                            </p>
                            
                            <div class="row g-3">
                                <div class="col-sm-6 col-md-3">
                                    <div class="p-3 bg-white rounded shadow-sm text-center border">
                                        <i class="bi bi-shield-check text-primary fs-3 mb-2 d-block"></i>
                                        <span class="fw-bold d-block">Garantía</span>
                                        <small class="text-muted">3 Años Oficial</small>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-md-3">
                                    <div class="p-3 bg-white rounded shadow-sm text-center border">
                                        <i class="bi bi-plug text-primary fs-3 mb-2 d-block"></i>
                                        <span class="fw-bold d-block">Instalación</span>
                                        <small class="text-muted">Fácil / Plug&Play</small>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-md-3">
                                    <div class="p-3 bg-white rounded shadow-sm text-center border">
                                        <i class="bi bi-award text-primary fs-3 mb-2 d-block"></i>
                                        <span class="fw-bold d-block">Calidad</span>
                                        <small class="text-muted">Certificación CE</small>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-md-3">
                                    <div class="p-3 bg-white rounded shadow-sm text-center border">
                                        <i class="bi bi-headset text-primary fs-3 mb-2 d-block"></i>
                                        <span class="fw-bold d-block">Soporte</span>
                                        <small class="text-muted">Asistencia 24/7</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            ${htmlSimilares}
            ${htmlRecomendados}

        </div>
    `;
}

// --- FUNCIONES AUXILIARES UI ---
function togglePass(id, mostrar) {
    const input = document.getElementById(id);
    if (input) input.type = mostrar ? "text" : "password";
}

function formatearTarjeta(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{4})(?=\d)/g, '$1-'); 
    input.value = valor;
}

function formatearFecha(input) {
    let valor = input.value.replace(/\D/g, ''); 
    if (valor.length > 4) valor = valor.substring(0, 4);

    if (valor.length >= 2) {
        let mes = parseInt(valor.substring(0, 2));
        if (mes > 12) mes = 12;
        if (mes === 0) mes = 1; 
        valor = mes.toString().padStart(2, '0') + valor.substring(2);
    }

    if (valor.length > 2) {
        input.value = valor.substring(0, 2) + '/' + valor.substring(2, 4);
    } else {
        input.value = valor;
    }
}

function formatearCVV(input) {
    input.value = input.value.replace(/\D/g, ''); 
}

// --- 6. FORMULARIOS DE AUTENTICACIÓN ---
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
                                <div class="mb-3">
                                    <label class="form-label text-muted small">Teléfono de contacto <span class="text-muted">(opcional)</span></label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                                        <input type="tel" id="reg-telefono" class="form-control" placeholder="+34 600 000 000">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-muted small">Dirección de envío <span class="text-muted">(opcional)</span></label>
                                    <input type="text" id="reg-direccion" class="form-control" placeholder="Calle, número, piso...">
                                </div>
                                <div class="row g-2 mb-3">
                                    <div class="col-5">
                                        <label class="form-label text-muted small">Código postal</label>
                                        <input type="text" id="reg-cp" class="form-control" placeholder="07001" maxlength="5" pattern="[0-9]{4,5}" title="Debe contener 4 o 5 números" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                                    </div>
                                    <div class="col-7">
                                        <label class="form-label text-muted small">Ciudad</label>
                                        <input type="text" id="reg-ciudad" class="form-control" placeholder="Palma">
                                    </div>
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
                                    <div class="form-text">Mínimo 8 caracteres, mayúscula, número y símbolo.</div>
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
        const adminLink = (usuario.rol === 'admin') ? '<li><a class="dropdown-item" href="#admin"><i class="bi bi-shield-lock me-2"></i> Panel Admin</a></li>' : '';

        contenedor.innerHTML = `
            <div class="nav-item dropdown">
                <a class="nav-link dropdown-toggle fw-semibold text-primary mx-2" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-person-check-fill"></i> ${usuario.nombre.split(' ')[0]}
                </a>
                <ul class="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="#cuenta"><i class="bi bi-box-seam me-2"></i> Mis Pedidos</a></li>
                    <li><a class="dropdown-item" href="#wishlist"><i class="bi bi-heart text-danger me-2"></i> Lista de Deseos</a></li>
                    <li><a class="dropdown-item" href="#perfil"><i class="bi bi-person-gear me-2"></i> Mi Cuenta</a></li>
                    ${adminLink} 
                    <li><hr class="dropdown-divider"></li>
                    <li><button class="dropdown-item text-danger small fw-semibold" onclick="cerrarSesion()"><i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión</button></li>
                </ul>
            </div>
        `;
    } else {
        contenedor.innerHTML = `<a href="#login" class="nav-link fw-semibold mx-2"><i class="bi bi-person-circle"></i> Login</a>`;
    }
}

function cerrarSesion() {
    wishlist = [];
    localStorage.removeItem('usuarioTelecom');
    alert("Has cerrado sesión correctamente.");
    actualizarMenuNavegacion();
    window.location.hash = "#home";
}

async function registrarUsuario(event) {
    event.preventDefault();

    const nombre    = document.getElementById('reg-nombre').value.trim();
    const email     = document.getElementById('reg-email').value.trim();
    const password  = document.getElementById('reg-password').value;
    const telefono  = document.getElementById('reg-telefono')?.value.trim() || '';
    const direccion = document.getElementById('reg-direccion')?.value.trim() || '';
    const cp        = document.getElementById('reg-cp')?.value.trim() || '';
    const ciudad    = document.getElementById('reg-ciudad')?.value.trim() || '';

    if (telefono && !/^\+?[\d\s\-]{7,15}$/.test(telefono)) {
        alert('El formato del teléfono no es válido (ej: +34 600 000 000).');
        return;
    }
    if (cp && !/^\d{4,5}$/.test(cp)) {
        alert('El código postal debe tener 4 o 5 dígitos.');
        return;
    }

    try {
        const respuesta = await fetch('../backend/registro.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password, telefono, direccion, codigo_postal: cp, ciudad })
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
            
            // <--- LÍNEA NUEVA: Cargamos los favoritos nada más entrar
            await cargarWishlist(resultado.usuario.id); 

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
        
        const cantidadActual = itemExistente ? itemExistente.cantidad : 0;
        if (cantidadActual + 1 > producto.stock) {
            alert(`No puedes añadir más. Solo quedan ${producto.stock} unidades en stock.`);
            return;
        }

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
    
    const productoOriginal = productos.find(p => p.id === id);
    
    if (cantidad > productoOriginal.stock) {
        alert(`Stock insuficiente. Máximo disponible: ${productoOriginal.stock}.`);
        renderizarCarrito(); // <--- AÑADE ESTA LÍNEA AQUÍ PARA CORREGIR EL BUG VISUAL
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
                        <input type="number" class="form-control text-center bg-white text-dark" value="${item.cantidad}" onchange="cambiarCantidad(${item.id}, this.value)" min="1" max="${item.stock}">
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

        const num = numInput.value.replace(/-/g, ''); 
        const cvv = cvvInput.value;
        const date = dateInput.value;

        const numValido = /^\d{16}$/.test(num);
        const cvvValido = /^\d{3}$/.test(cvv);
        const dateValido = /^(0[1-9]|1[0-2])\/\d{2}$/.test(date);

        return numValido && cvvValido && dateValido;
    }
}

async function procesarPago() {
    if (carrito.length === 0) return alert("El carrito está vacío.");

    const metodoPago = document.getElementById("metodo-pago").value;
    
    if (!validarPago(metodoPago)) {
        alert("Por favor, introduce datos de pago válidos (Ej: 16 dígitos para tarjetas o un email válido para PayPal).");
        return;
    }

    const usuarioSession = localStorage.getItem('usuarioTelecom');
    const total = carrito.reduce((acc, i) => acc + (parseFloat(i.precio) * i.cantidad), 0) * 1.21;

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
        setTimeout(() => { 
            window.location.hash = usuarioSession ? "#cuenta" : "#home"; 
            location.reload(); 
        }, 4000);
    };

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

// --- 11. PANEL DE ADMINISTRACIÓN ---
async function renderizarAdmin() {
    const contenedor = document.getElementById("admin");
    const usuarioSession = localStorage.getItem('usuarioTelecom');
    const admin = JSON.parse(usuarioSession);
    idAdminActivo = admin.id; 

    contenedor.innerHTML = `
        <div class="container py-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="fw-bold m-0"><i class="bi bi-shield-lock text-primary me-2"></i>Panel de Administración</h2>
                <span class="badge bg-primary fs-6">Bienvenido, ${admin.nombre.split(' ')[0]}</span>
            </div>

            <ul class="nav nav-tabs mb-4" id="adminTabs">
                <li class="nav-item">
                    <button class="nav-link active" onclick="mostrarPestanaAdmin('pedidos')">
                        <i class="bi bi-receipt me-1"></i> Pedidos
                    </button>
                </li>
                <li class="nav-item">
                    <button class="nav-link" onclick="mostrarPestanaAdmin('productos')">
                        <i class="bi bi-box-seam me-1"></i> Productos
                    </button>
                </li>
            </ul>

            <div id="admin-tab-pedidos">
                <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                    <span id="contador-pedidos" class="text-muted small">Cargando...</span>
                    
                    <div class="input-group shadow-sm" style="max-width: 350px;">
                        <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
                        <input type="text" class="form-control border-start-0 ps-0" placeholder="Buscar por ID, cliente o estado..." oninput="filtrarPedidosAdmin(this.value)">
                    </div>

                    <button class="btn btn-sm btn-outline-secondary shadow-sm" onclick="cargarPedidosAdmin()">
                        <i class="bi bi-arrow-clockwise me-1"></i>Actualizar
                    </button>
                </div>
                
                <div class="card shadow-sm border-0">
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="ps-4">ID</th>
                                        <th>Fecha</th>
                                        <th>Cliente</th>
                                        <th>Estado</th>
                                        <th class="text-end">Total</th>
                                        <th class="text-end pe-4">Detalle</th>
                                    </tr>
                                </thead>
                                <tbody id="tbody-admin-pedidos">
                                    <tr><td colspan="6" class="text-center py-5"><div class="spinner-border text-primary" role="status"></div></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div id="admin-tab-productos" style="display:none;">
                <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                    <span id="contador-productos" class="text-muted small">Cargando...</span>
                    
                    <div class="input-group shadow-sm" style="max-width: 350px;">
                        <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
                        <input type="text" class="form-control border-start-0 ps-0" placeholder="Buscar por nombre, categoría o marca..." oninput="filtrarProductosAdmin(this.value)">
                    </div>

                    <button class="btn btn-success btn-sm shadow-sm" onclick="mostrarFormularioNuevoProducto(idAdminActivo)">
                        <i class="bi bi-plus-lg me-1"></i>Añadir Producto
                    </button>
                </div>
                
                <div id="formulario-nuevo-producto"></div>
                
                <div class="card shadow-sm border-0">
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="ps-4">Producto</th>
                                        <th>Categoría</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th class="pe-4">Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody id="tbody-admin-productos">
                                    <tr><td colspan="5" class="text-center py-5"><div class="spinner-border text-primary" role="status"></div></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    cargarPedidosAdmin(admin.id);
    cargarProductosAdmin(admin.id);
}

function mostrarPestanaAdmin(tab) {
    const tabPedidos = document.getElementById('admin-tab-pedidos');
    const tabProductos = document.getElementById('admin-tab-productos');
    
    if (tabPedidos) tabPedidos.style.display = tab === 'pedidos' ? 'block' : 'none';
    if (tabProductos) tabProductos.style.display = tab === 'productos' ? 'block' : 'none';

    document.querySelectorAll('#adminTabs .nav-link').forEach((btn, i) => {
        btn.classList.toggle('active', (tab === 'pedidos' && i === 0) || (tab === 'productos' && i === 1));
    });
}


// --- 12. CARGAR Y FILTRAR PEDIDOS (Panel Admin) ---
async function cargarPedidosAdmin(adminId) {
    const aId = adminId || idAdminActivo;
    const tbody = document.getElementById("tbody-admin-pedidos");
    if (!tbody) return;

    try {
        const respuesta = await fetch('../backend/admin_api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ admin_id: aId })
        });

        adminPedidosGlobal = await respuesta.json();
        if (!respuesta.ok) throw new Error(adminPedidosGlobal.error || "Error de servidor");

        filtrarPedidosAdmin(""); 

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4"><i class="bi bi-exclamation-triangle me-2"></i>${error.message}</td></tr>`;
        document.getElementById("contador-pedidos").innerText = "Error";
    }
}

function filtrarPedidosAdmin(texto) {
    const tbody = document.getElementById("tbody-admin-pedidos");
    if (!tbody) return;

    const termino = texto.toLowerCase().trim();
    
    // CORRECCIÓN: Validamos si p.nombre, p.email o p.estado existen antes de usar .toLowerCase()
    const filtrados = adminPedidosGlobal.filter(p => 
        p.id.toString().includes(termino) ||
        (p.nombre ? p.nombre.toLowerCase().includes(termino) : false) ||
        (p.email ? p.email.toLowerCase().includes(termino) : false) ||
        (p.estado ? p.estado.toLowerCase().includes(termino) : false)
    );

    document.getElementById("contador-pedidos").innerText = `${filtrados.length} pedidos encontrados`;

    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-5"><i class="bi bi-inbox fs-1 d-block mb-3"></i>No se encontraron pedidos con "${texto}".</td></tr>`;
        return;
    }

    tbody.innerHTML = filtrados.map(p => {
        const badgeColor = p.estado === 'Procesando' ? 'bg-warning text-dark' 
                         : p.estado === 'Completado' ? 'bg-success' 
                         : 'bg-secondary';
                         
        // Si el usuario borró su cuenta, p.nombre vendrá vacío, así que lo anonimizamos elegantemente
        const nombreCliente = p.nombre ? p.nombre : '<span class="text-danger small fw-bold"><i class="bi bi-person-x"></i> Cuenta Eliminada</span>';
        const emailCliente = p.email ? p.email : '<span class="text-muted small">Anonimizado por RGPD</span>';
                         
        return `
            <tr>
                <td class="fw-semibold ps-4">#${p.id}</td>
                <td>${new Date(p.fecha_pedido).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td>
                    <div class="fw-bold">${nombreCliente}</div>
                    <div class="small text-muted">${emailCliente}</div>
                </td>
                <td><span class="badge ${badgeColor}">${p.estado}</span></td>
                <td class="text-end fw-bold text-primary">${parseFloat(p.total).toFixed(2)} €</td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-outline-info" onclick="verDetallesPedidoAdmin(${p.id})" title="Ver artículos">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            </tr>`;
    }).join('');
}

// --- FUNCIÓN VISUAL PARA VER DETALLES DE PEDIDO EN ADMIN ---
function verDetallesPedidoAdmin(id) {
    const pedido = adminPedidosGlobal.find(p => p.id === id);
    if (!pedido) return;

    // Limpiar modal anterior si existiera para que no se dupliquen
    const modalAnterior = document.getElementById('modalAdminPedido');
    if (modalAnterior) modalAnterior.remove();

    // Generar la lista de productos comprados (HTML)
    const detallesHTML = pedido.detalles.map(det => `
        <li class="list-group-item d-flex justify-content-between align-items-center py-3">
            <div>
                <h6 class="mb-1 fw-bold text-dark">${det.nombre}</h6>
                <small class="text-muted">${det.cantidad} unidades x ${parseFloat(det.precio_unitario).toFixed(2)} €</small>
            </div>
            <div class="fw-bold text-dark">
                ${(det.cantidad * parseFloat(det.precio_unitario)).toFixed(2)} €
            </div>
        </li>
    `).join('');

    // Estructura del Modal de Bootstrap
    const modalHTML = `
        <div class="modal fade" id="modalAdminPedido" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content border-0 shadow">
              <div class="modal-header bg-light border-bottom-0 pb-3">
                <h5 class="modal-title fw-bold text-primary">
                    <i class="bi bi-receipt me-2"></i>Detalle del Pedido #${pedido.id}
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              
              <div class="modal-body p-0">
                <div class="bg-primary bg-opacity-10 p-4 border-bottom">
                    <div class="row">
                        <div class="col-sm-6 mb-3 mb-sm-0">
                            <p class="mb-1 small text-muted text-uppercase fw-bold">Datos del Cliente</p>
                            <p class="mb-0 fw-semibold text-dark"><i class="bi bi-person me-2"></i>${pedido.nombre}</p>
                            <p class="mb-0 small text-dark"><i class="bi bi-envelope me-2"></i>${pedido.email}</p>
                        </div>
                        <div class="col-sm-6 text-sm-end">
                            <p class="mb-1 small text-muted text-uppercase fw-bold">Información de Compra</p>
                            <p class="mb-1 small text-dark"><i class="bi bi-calendar3 me-2"></i>${new Date(pedido.fecha_pedido).toLocaleString('es-ES')}</p>
                            <span class="badge ${pedido.estado === 'Procesando' ? 'bg-warning text-dark' : 'bg-success'} fs-6 mt-1">${pedido.estado}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Lista de artículos -->
                <ul class="list-group list-group-flush">
                    ${detallesHTML}
                </ul>
              </div>
              
              <div class="modal-footer bg-light border-top-0 d-flex justify-content-between align-items-center py-3">
                <span class="text-muted fw-bold text-uppercase small">Total del Pedido</span>
                <span class="fs-3 fw-bold text-primary">${parseFloat(pedido.total).toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
    `;

    // Inyectamos el HTML al final de la página web
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Le pedimos a Bootstrap que lo muestre animado
    const modalElement = document.getElementById('modalAdminPedido');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Cuando el usuario cierre el modal, limpiamos la basura del HTML
    modalElement.addEventListener('hidden.bs.modal', () => {
        modalElement.remove();
    });
}

// --- 13. CARGAR Y FILTRAR PRODUCTOS (Panel Admin) ---
async function cargarProductosAdmin() {
    const tbody = document.getElementById("tbody-admin-productos");
    if (!tbody) return;

    try {
        const respuesta = await fetch('../backend/get_productos.php');
        adminProductosGlobal = await respuesta.json();
        
        filtrarProductosAdmin(""); 

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-4"><i class="bi bi-exclamation-triangle me-2"></i>No se pudieron cargar los productos.</td></tr>`;
        document.getElementById("contador-productos").innerText = "Error";
    }
}

function filtrarProductosAdmin(texto) {
    const tbody = document.getElementById("tbody-admin-productos");
    if (!tbody) return;

    const termino = texto.toLowerCase().trim();
    
    const filtrados = adminProductosGlobal.filter(p => 
        p.nombre.toLowerCase().includes(termino) ||
        p.categoria.toLowerCase().includes(termino) ||
        (p.marca && p.marca.toLowerCase().includes(termino))
    );

    document.getElementById("contador-productos").innerText = `${filtrados.length} productos en catálogo`;

    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-5"><i class="bi bi-box-seam fs-1 d-block mb-3"></i>No hay productos que coincidan con "${texto}".</td></tr>`;
        return;
    }

    tbody.innerHTML = filtrados.map(p => `
        <tr>
            <td class="ps-4">
                <img src="${p.imagen}" style="width:45px;height:45px;object-fit:contain;" class="rounded bg-light me-2">
                <span class="fw-semibold">${p.nombre}</span>
            </td>
            <td><span class="badge bg-secondary">${p.categoria}</span></td>
            <td>${parseFloat(p.precio).toFixed(2)} €</td>
            <td>
                <div class="input-group input-group-sm" style="width:130px;">
                    <input type="number" id="stock-${p.id}" class="form-control" value="${p.stock}" min="0">
                    <button class="btn btn-outline-primary" onclick="actualizarStock(${p.id}, idAdminActivo)">
                        <i class="bi bi-check-lg"></i>
                    </button>
                </div>
            </td>
            <td class="pe-4">
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${p.id}, idAdminActivo)">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>`).join('');
}

// --- 14. ACTUALIZAR STOCK ---
async function actualizarStock(productoId, adminId) {
    const nuevoStock = parseInt(document.getElementById(`stock-${productoId}`).value);
    if (isNaN(nuevoStock) || nuevoStock < 0) {
        alert("Introduce un valor de stock válido (0 o mayor).");
        return;
    }

    const usuarioSession = localStorage.getItem('usuarioTelecom');
    const admin = adminId ? { id: adminId } : JSON.parse(usuarioSession);

    try {
        const respuesta = await fetch('../backend/admin_productos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ admin_id: admin.id, accion: 'actualizar_stock', producto_id: productoId, stock: nuevoStock })
        });
        const res = await respuesta.json();
        if (respuesta.ok) {
            const prod = productos.find(p => p.id === productoId);
            if (prod) prod.stock = nuevoStock;
            alert(res.mensaje);
        } else {
            alert("Error: " + res.error);
        }
    } catch (e) {
        alert("Error de conexión al actualizar el stock.");
    }
}

// --- 15. ELIMINAR PRODUCTO ---
async function eliminarProducto(productoId, adminId) {
    if (!confirm("¿Seguro que quieres eliminar este producto? Esta acción no se puede deshacer.")) return;

    const usuarioSession = localStorage.getItem('usuarioTelecom');
    const admin = adminId ? { id: adminId } : JSON.parse(usuarioSession);

    try {
        const respuesta = await fetch('../backend/admin_productos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ admin_id: admin.id, accion: 'eliminar', producto_id: productoId })
        });
        const res = await respuesta.json();
        if (respuesta.ok) {
            productos = productos.filter(p => p.id !== productoId);
            alert(res.mensaje);
            cargarProductosAdmin(admin.id);
        } else {
            alert("Error: " + res.error);
        }
    } catch (e) {
        alert("Error de conexión al eliminar el producto.");
    }
}

// --- 16. FORMULARIO NUEVO PRODUCTO ---
function mostrarFormularioNuevoProducto(adminId) {
    const contenedor = document.getElementById("formulario-nuevo-producto");
    if (!contenedor) return;

    if (contenedor.innerHTML.trim() !== '') {
        contenedor.innerHTML = '';
        return;
    }

    contenedor.innerHTML = `
        <div class="card shadow-sm border-0 mb-4 bg-light">
            <div class="card-body p-4">
                <h5 class="fw-bold mb-4"><i class="bi bi-plus-circle me-2 text-success"></i>Nuevo Producto</h5>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label text-muted small">Nombre del producto</label>
                        <input type="text" id="np-nombre" class="form-control" placeholder="Ej: Switch Cisco SG110" required>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label text-muted small">Marca</label>
                        <input type="text" id="np-marca" class="form-control" placeholder="Ej: Cisco">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label text-muted small">Categoría</label>
                        <input type="text" id="np-categoria" class="form-control" placeholder="Ej: Switches">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label text-muted small">Precio (€)</label>
                        <input type="number" id="np-precio" class="form-control" placeholder="0.00" min="0" step="0.01">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label text-muted small">Stock inicial</label>
                        <input type="number" id="np-stock" class="form-control" placeholder="0" min="0">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-muted small">URL de imagen</label>
                        <input type="text" id="np-imagen" class="form-control" placeholder="https://...">
                    </div>
                    <div class="col-12">
                        <label class="form-label text-muted small">Descripción</label>
                        <textarea id="np-descripcion" class="form-control" rows="2" placeholder="Descripción breve del producto..."></textarea>
                    </div>
                    <div class="col-12 d-flex gap-2 justify-content-end">
                        <button class="btn btn-outline-secondary" onclick="document.getElementById('formulario-nuevo-producto').innerHTML=''">
                            Cancelar
                        </button>
                        <button class="btn btn-success" onclick="guardarNuevoProducto(${adminId})">
                            <i class="bi bi-check-lg me-1"></i>Guardar Producto
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// --- 17. GUARDAR NUEVO PRODUCTO ---
async function guardarNuevoProducto(adminId) {
    const nombre     = document.getElementById('np-nombre')?.value.trim();
    const marca      = document.getElementById('np-marca')?.value.trim();
    const categoria  = document.getElementById('np-categoria')?.value.trim();
    const precio     = parseFloat(document.getElementById('np-precio')?.value);
    const stock      = parseInt(document.getElementById('np-stock')?.value);
    const imagen     = document.getElementById('np-imagen')?.value.trim();
    const descripcion = document.getElementById('np-descripcion')?.value.trim();

    if (!nombre || !marca || !categoria || isNaN(precio) || isNaN(stock)) {
        alert("Por favor, rellena todos los campos obligatorios (nombre, marca, categoría, precio y stock).");
        return;
    }

    const usuarioSession = localStorage.getItem('usuarioTelecom');
    const admin = adminId ? { id: adminId } : JSON.parse(usuarioSession);

    try {
        const respuesta = await fetch('../backend/admin_productos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                admin_id: admin.id,
                accion: 'añadir',
                nombre, marca, categoria, precio, stock, imagen, descripcion
            })
        });
        const res = await respuesta.json();
        if (respuesta.ok) {
            alert(res.mensaje);
            document.getElementById('formulario-nuevo-producto').innerHTML = '';
            cargarProductosAdmin(admin.id);
        } else {
            alert("Error: " + res.error);
        }
    } catch (e) {
        alert("Error de conexión al guardar el producto.");
    }
}
// --- 18. PERFIL DE USUARIO ---
async function renderizarPerfil() {
    const contenedor = document.getElementById("perfil");
    if (!contenedor) return;

    const usuarioSesion = JSON.parse(localStorage.getItem('usuarioTelecom'));

    contenedor.innerHTML = `
        <div class="container py-5 text-center">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3 text-muted">Cargando tus datos...</p>
        </div>
    `;

    try {
        const respuesta = await fetch('../backend/obtener_perfil.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuarioSesion.id })
        });

        if (!respuesta.ok) throw new Error("No se pudo cargar el perfil");
        
        const usuarioDB = await respuesta.json();

        localStorage.setItem('usuarioTelecom', JSON.stringify(usuarioDB));

        contenedor.innerHTML = `
            <div class="container py-5" style="max-width: 680px;">
                <div class="mb-5">
                    <h2 class="fw-bold mb-1"><i class="bi bi-person-gear text-primary me-2"></i>Mi Cuenta</h2>
                    <p class="text-muted mb-0">Gestiona tus datos personales y credenciales de acceso.</p>
                </div>

                <div class="card shadow-sm border-0 mb-4">
                    <div class="card-body p-4">
                        <h5 class="fw-bold mb-4"><i class="bi bi-person me-2 text-primary"></i>Datos Personales</h5>
                        <div class="mb-3">
                            <label class="form-label text-muted small">Nombre completo</label>
                            <input type="text" id="perfil-nombre" class="form-control" value="${usuarioDB.nombre || ''}" minlength="3" required>
                        </div>
                        <div class="mb-4">
                            <label class="form-label text-muted small">Correo electrónico</label>
                            <input type="email" id="perfil-email" class="form-control" value="${usuarioDB.email || ''}" required>
                        </div>
                        <button class="btn btn-primary" onclick="guardarDatosPersonales()">
                            <i class="bi bi-check-lg me-1"></i>Guardar cambios
                        </button>
                        <div id="msg-datos" class="mt-3"></div>
                    </div>
                </div>

                <div class="card shadow-sm border-0 mb-4">
                    <div class="card-body p-4">
                        <h5 class="fw-bold mb-4"><i class="bi bi-geo-alt me-2 text-primary"></i>Contacto y Dirección de Envío</h5>
                        <div class="mb-3">
                            <label class="form-label text-muted small">Teléfono de contacto</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                                <input type="tel" id="perfil-telefono" class="form-control" value="${usuarioDB.telefono || ''}" placeholder="+34 600 000 000">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted small">Dirección</label>
                            <input type="text" id="perfil-direccion" class="form-control" value="${usuarioDB.direccion || ''}" placeholder="Calle, número, piso...">
                        </div>
                        <div class="row g-3 mb-4">
                            <div class="col-5">
                                <label class="form-label text-muted small">Código postal</label>
                                <input type="text" id="perfil-cp" class="form-control" value="${usuarioDB.codigo_postal || ''}" placeholder="07001" maxlength="5" pattern="[0-9]{4,5}" title="Debe contener 4 o 5 números" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                            </div>
                            <div class="col-7">
                                <label class="form-label text-muted small">Ciudad</label>
                                <input type="text" id="perfil-ciudad" class="form-control" value="${usuarioDB.ciudad || ''}" placeholder="Palma">
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="guardarDireccion()">
                            <i class="bi bi-check-lg me-1"></i>Guardar cambios
                        </button>
                        <div id="msg-direccion" class="mt-3"></div>
                    </div>
                </div>

                <div class="card shadow-sm border-0 mb-4">
                    <div class="card-body p-4">
                        <h5 class="fw-bold mb-4"><i class="bi bi-lock me-2 text-primary"></i>Cambiar Contraseña</h5>
                        <div class="mb-3">
                            <label class="form-label text-muted small">Contraseña actual</label>
                            <div class="input-group">
                                <input type="password" id="perfil-pass-actual" class="form-control" placeholder="••••••••">
                                <button class="btn btn-outline-secondary" type="button"
                                    onmousedown="togglePass('perfil-pass-actual', true)"
                                    onmouseup="togglePass('perfil-pass-actual', false)"
                                    onmouseleave="togglePass('perfil-pass-actual', false)">
                                    <i class="bi bi-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted small">Nueva contraseña</label>
                            <div class="input-group">
                                <input type="password" id="perfil-pass-nueva" class="form-control" placeholder="••••••••"
                                    pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}"
                                    title="Mínimo 8 caracteres, una mayúscula, un número y un símbolo (!@#$%^&*)">
                                <button class="btn btn-outline-secondary" type="button"
                                    onmousedown="togglePass('perfil-pass-nueva', true)"
                                    onmouseup="togglePass('perfil-pass-nueva', false)"
                                    onmouseleave="togglePass('perfil-pass-nueva', false)">
                                    <i class="bi bi-eye"></i>
                                </button>
                            </div>
                            <div class="form-text">Mínimo 8 caracteres, mayúscula, número y símbolo.</div>
                        </div>
                        <div class="mb-4">
                            <label class="form-label text-muted small">Repetir nueva contraseña</label>
                            <input type="password" id="perfil-pass-repetir" class="form-control" placeholder="••••••••">
                        </div>
                        <button class="btn btn-primary" onclick="guardarContrasena()">
                            <i class="bi bi-check-lg me-1"></i>Cambiar contraseña
                        </button>
                        <div id="msg-password" class="mt-3"></div>
                    </div>
                </div>
                <div class="card shadow-sm border-0 border-start border-danger border-4 mb-4">
                    <div class="card-body p-4">
                        <h5 class="fw-bold text-danger mb-3"><i class="bi bi-exclamation-triangle me-2"></i>Zona de Peligro</h5>
                        <p class="text-muted small mb-4">
                            Al eliminar tu cuenta, se borrarán de forma permanente todos tus datos personales de nuestros registros lógicos. Esta acción es irreversible y perderás el acceso a tu historial de pedidos.
                        </p>
                        <button class="btn btn-danger" onclick="eliminarCuentaUsuario()">
                            <i class="bi bi-person-x me-1"></i>Eliminar mi cuenta definitivamente
                        </button>
                    </div>
                </div>
            </div>
        `;
    } catch (e) {
        contenedor.innerHTML = `<div class="container py-5"><div class="alert alert-danger shadow-sm">No se pudieron cargar los datos de tu perfil en este momento. Inténtalo más tarde.</div></div>`;
        console.error(e);
    }
}

// --- HELPERS DE FEEDBACK ---
function mostrarMensajePerfil(idContenedor, tipo, texto) {
    const el = document.getElementById(idContenedor);
    if (!el) return;
    el.innerHTML = `<div class="alert alert-${tipo} py-2 px-3 small mb-0"><i class="bi bi-${tipo === 'success' ? 'check-circle' : 'exclamation-triangle'} me-1"></i>${texto}</div>`;
    setTimeout(() => { el.innerHTML = ''; }, 4000);
}

// --- GUARDAR DATOS PERSONALES ---
async function guardarDatosPersonales() {
    const usuario = JSON.parse(localStorage.getItem('usuarioTelecom'));
    const nombre = document.getElementById('perfil-nombre')?.value.trim();
    const email  = document.getElementById('perfil-email')?.value.trim();

    if (!nombre || nombre.length < 3) {
        mostrarMensajePerfil('msg-datos', 'warning', 'El nombre debe tener al menos 3 caracteres.');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarMensajePerfil('msg-datos', 'warning', 'El formato del email no es válido.');
        return;
    }

    try {
        const respuesta = await fetch('../backend/actualizar_perfil.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuario.id, accion: 'datos_personales', nombre, email })
        });
        const res = await respuesta.json();
        if (respuesta.ok) {
            usuario.nombre = nombre;
            usuario.email  = email;
            localStorage.setItem('usuarioTelecom', JSON.stringify(usuario));
            actualizarMenuNavegacion();
            mostrarMensajePerfil('msg-datos', 'success', '¡Datos actualizados correctamente!');
        } else {
            mostrarMensajePerfil('msg-datos', 'danger', res.error || 'Error al guardar los datos.');
        }
    } catch (e) {
        mostrarMensajePerfil('msg-datos', 'danger', 'Error de conexión con el servidor.');
    }
}

// --- GUARDAR DIRECCIÓN ---
async function guardarDireccion() {
    const usuario   = JSON.parse(localStorage.getItem('usuarioTelecom'));
    const telefono  = document.getElementById('perfil-telefono')?.value.trim();
    const direccion = document.getElementById('perfil-direccion')?.value.trim();
    const cp        = document.getElementById('perfil-cp')?.value.trim();
    const ciudad    = document.getElementById('perfil-ciudad')?.value.trim();

    if (telefono && !/^\+?[\d\s\-]{7,15}$/.test(telefono)) {
        mostrarMensajePerfil('msg-direccion', 'warning', 'El formato del teléfono no es válido (ej: +34 600 000 000).');
        return;
    }
    if (cp && !/^\d{4,5}$/.test(cp)) {
        mostrarMensajePerfil('msg-direccion', 'warning', 'El código postal debe tener 4 o 5 dígitos.');
        return;
    }

    try {
        const respuesta = await fetch('../backend/actualizar_perfil.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuario.id, accion: 'direccion', telefono, direccion, codigo_postal: cp, ciudad })
        });
        const res = await respuesta.json();
        if (respuesta.ok) {
            usuario.telefono      = telefono;
            usuario.direccion     = direccion;
            usuario.codigo_postal = cp;
            usuario.ciudad        = ciudad;
            localStorage.setItem('usuarioTelecom', JSON.stringify(usuario));
            mostrarMensajePerfil('msg-direccion', 'success', '¡Contacto y dirección guardados correctamente!');
        } else {
            mostrarMensajePerfil('msg-direccion', 'danger', res.error || 'Error al guardar los datos.');
        }
    } catch (e) {
        mostrarMensajePerfil('msg-direccion', 'danger', 'Error de conexión con el servidor.');
    }
}

// --- CAMBIAR CONTRASEÑA ---
async function guardarContrasena() {
    const usuario     = JSON.parse(localStorage.getItem('usuarioTelecom'));
    const actual      = document.getElementById('perfil-pass-actual')?.value;
    const nueva       = document.getElementById('perfil-pass-nueva')?.value;
    const repetir     = document.getElementById('perfil-pass-repetir')?.value;

    if (!actual || !nueva || !repetir) {
        mostrarMensajePerfil('msg-password', 'warning', 'Rellena todos los campos de contraseña.');
        return;
    }
    if (nueva !== repetir) {
        mostrarMensajePerfil('msg-password', 'warning', 'La nueva contraseña y su repetición no coinciden.');
        return;
    }
    const patronSeguro = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!patronSeguro.test(nueva)) {
        mostrarMensajePerfil('msg-password', 'warning', 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo (!@#$%^&*).');
        return;
    }

    try {
        const respuesta = await fetch('../backend/actualizar_perfil.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuario.id, accion: 'password', password_actual: actual, password_nueva: nueva })
        });
        const res = await respuesta.json();
        if (respuesta.ok) {
            document.getElementById('perfil-pass-actual').value  = '';
            document.getElementById('perfil-pass-nueva').value   = '';
            document.getElementById('perfil-pass-repetir').value = '';
            mostrarMensajePerfil('msg-password', 'success', '¡Contraseña actualizada correctamente!');
        } else {
            mostrarMensajePerfil('msg-password', 'danger', res.error || 'Error al cambiar la contraseña.');
        }
    } catch (e) {
        mostrarMensajePerfil('msg-password', 'danger', 'Error de conexión con el servidor.');
    }
}

// --- 19. NAVEGACIÓN INTERNA DE LOS PORTALES LEGALES (Índices laterales) ---
document.addEventListener("click", (evento) => {
    // Comprobamos si el clic se ha hecho dentro de un enlace del índice
    const linkLocal = evento.target.closest('.transition-link');
    
    if (linkLocal) {
        // 1. Evitamos el comportamiento por defecto (que cambiaría la URL y rompería la SPA)
        evento.preventDefault(); 
        
        // 2. Obtenemos a qué ID quiere ir (ejemplo: "#legal-datos")
        const destino = linkLocal.getAttribute('href'); 
        const elementoDestino = document.querySelector(destino);
        
        // 3. Si el elemento existe, hacemos scroll suave hacia él
        if (elementoDestino) {
            elementoDestino.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// --- 20. ELIMINAR CUENTA DE USUARIO DEFINITIVAMENTE ---
async function eliminarCuentaUsuario() {
    const usuarioSesion = JSON.parse(localStorage.getItem('usuarioTelecom'));
    if (!usuarioSesion) return;

    // Confirmación nativa por seguridad
    const primeraConfirmacion = confirm("¿Estás absolutamente seguro de que quieres eliminar tu cuenta de Telecom? Perderás todo tu historial de pedidos de forma permanente.");
    if (!primeraConfirmacion) return;

    const segundaConfirmacion = confirm("¿De verdad quieres proceder? Esta acción NO se puede deshacer y tus datos serán eliminados de la base de datos.");
    if (!segundaConfirmacion) return;

    try {
        const respuesta = await fetch('../backend/eliminar_cuenta.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuarioSesion.id })
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            alert(resultado.mensaje || "Tu cuenta ha sido eliminada correctamente.");
            
            // Destruimos la sesión en el navegador
            localStorage.removeItem('usuarioTelecom');
            
            // Actualizamos la barra de navegación para que vuelva a salir el botón de "Login"
            actualizarMenuNavegacion();
            
            // Redirigimos al Home de la SPA
            window.location.hash = "#home";
        } else {
            alert("Error del servidor: " + (resultado.error || "No se pudo procesar la solicitud."));
        }
    } catch (e) {
        console.error(e);
        alert("Error de conexión al intentar comunicar con el endpoint de borrado.");
    }
}

// --- 21. LISTA DE DESEOS (WISHLIST) ---
async function cargarWishlist(usuarioId) {
    try {
        const respuesta = await fetch('../backend/wishlist_api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuarioId, accion: 'get' })
        });
        if (respuesta.ok) wishlist = await respuesta.json();
    } catch (e) { console.error("Error al cargar wishlist:", e); }
}

async function toggleWishlist(productoId) {
    const usuarioSession = localStorage.getItem('usuarioTelecom');
    if (!usuarioSession) return;
    const usuario = JSON.parse(usuarioSession);

    try {
        const respuesta = await fetch('../backend/wishlist_api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuario.id, accion: 'toggle', producto_id: productoId })
        });
        const res = await respuesta.json();
        
        if (res.estado === 'añadido') {
            wishlist.push(productoId);
        } else if (res.estado === 'eliminado') {
            wishlist = wishlist.filter(id => id !== productoId);
        }
        
        // --- TRUCO DE UX: Evitar que la pantalla salte hacia arriba ---
        const scrollActual = window.scrollY; // Guardamos en qué píxel exacto está el usuario
        const originalScrollTo = window.scrollTo; // Guardamos la función original del navegador
        window.scrollTo = function() {}; // Desactivamos el scroll de la ventana (lo volvemos mudo)
        
        // Repintamos la vista (ahora si las otras funciones intentan hacer scroll, no pasará nada)
        const hash = window.location.hash;
        if (hash === "#catalogo" || hash === "#home" || hash === "") {
            if (hash === "#catalogo") renderizarCatalogo();
            else renderizarHome(); // Evitamos llamar a iniciarEnrutador() directamente
        }
        else if (hash.startsWith("#producto/")) renderizarDetalle(productoId);
        else if (hash === "#wishlist") renderizarWishlist();

        // Devolvemos todo a la normalidad en cuanto el DOM se haya repintado
        setTimeout(() => {
            window.scrollTo = originalScrollTo; // Le devolvemos su función original al navegador
            window.scrollTo(0, scrollActual);   // Lo anclamos al píxel donde estaba
        }, 10);

    } catch (e) {
        alert("Error al actualizar la lista de deseos.");
    }
}

function renderizarWishlist() {
    const contenedor = document.getElementById("wishlist");
    const productosDeseados = productos.filter(p => wishlist.includes(p.id));

    if (productosDeseados.length === 0) {
        contenedor.innerHTML = `
            <div class="container py-5 text-center">
                <i class="bi bi-heart-half text-muted" style="font-size: 4rem;"></i>
                <h2 class="mt-3 mb-4">Tu lista de deseos está vacía</h2>
                <p class="text-muted mb-4">Guarda aquí los productos que te interesan para no perderlos de vista.</p>
                <a href="#catalogo" class="btn btn-primary">Explorar Catálogo</a>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = `
        <div class="container py-5">
            <h2 class="mb-4 fw-bold"><i class="bi bi-heart-fill text-danger me-2"></i>Mi Lista de Deseos</h2>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                ${productosDeseados.map(p => `<div class="col">${generarTarjetaProducto(p, false)}</div>`).join('')}
            </div>
        </div>
    `;
}