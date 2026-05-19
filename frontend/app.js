// Mock de datos para desarrollo del Frontend. 
const productosMock = [
    { id: 1, nombre: "Switch Cisco Catalyst 2960", marca: "Cisco", categoria: "Switches", precio: 250.00, imagen: "https://via.placeholder.com/600x400?text=Switch+Cisco", descripcion: "Switch de 24 puertos Gigabit, ideal para pequeñas y medianas empresas. Alta fiabilidad y rendimiento." },
    { id: 2, nombre: "Router Ubiquiti EdgeRouter 4", marca: "Ubiquiti", categoria: "Routers", precio: 199.00, imagen: "https://via.placeholder.com/600x400?text=Router+Ubiquiti", descripcion: "Router avanzado de 4 puertos con gran capacidad de procesamiento. Millones de paquetes por segundo." },
    { id: 3, nombre: "Cable de Fibra Óptica LC-LC 5m", marca: "Genérico", categoria: "Cableado", precio: 15.50, imagen: "https://via.placeholder.com/600x400?text=Cable+Fibra", descripcion: "Latiguillo de fibra óptica multimodo OM3 dúplex. Perfecto para conexiones de alta velocidad." },
    { id: 4, nombre: "Access Point Aruba 515", marca: "Aruba", categoria: "Inalámbrico", precio: 320.00, imagen: "https://via.placeholder.com/600x400?text=Aruba+AP", descripcion: "Punto de acceso WiFi 6 de alto rendimiento para entornos de alta densidad de usuarios." }
];

// Estado global del carrito
let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
    
    // Controlador principal de navegación (SPA Router)
    const enrutador = () => {
        const hash = window.location.hash || "#home";

        if (hash === "#home" || hash === "") {
            document.getElementById("home").style.display = "block";
            renderizarHome();
        }
        
        
        const secciones = document.querySelectorAll("main > section");
        secciones.forEach(seccion => seccion.style.display = "none");

        if (hash.startsWith("#producto/")) {
            const partes = hash.split("/");
            const productoId = parseInt(partes[1]); 
            
            document.getElementById("producto").style.display = "block";
            renderizarDetalle(productoId);
            return; 
        }

        const seccionActiva = document.querySelector(hash);
        if (seccionActiva) {
            seccionActiva.style.display = "block";
        }

        if (hash === "#catalogo") {
            renderizarCatalogo();
        }
        
        if (hash === "#login") {
            renderizarLogin();
        }

        if (hash === "#carrito") {
            renderizarCarrito();
        }
    };

    window.addEventListener("hashchange", enrutador);
    enrutador();
});

// Función para renderizar la página principal con varios carruseles
function renderizarHome() {
    const contenedorHome = document.getElementById("home");
    
    // Contenedor principal de la página de inicio
    contenedorHome.innerHTML = `
        <div class="container py-5" id="home-content">
            <h2 class="mb-5 fw-bold text-center">Bienvenido a Telecom</h2>
        </div>
    `;
    
    const homeContent = document.getElementById("home-content");

    // Simulamos crear dos carruseles (puedes crear los que quieras)
    // Nota: slice() coge una porción del array para simular distintas listas
    const carrusel1 = construirCarrusel("Productos Destacados", productosMock, 'carrusel-destacados');
    
    // Invertimos el array para simular que son productos diferentes en el segundo carrusel
    const carrusel2 = construirCarrusel("Novedades en Redes", [...productosMock].reverse(), 'carrusel-novedades');

    homeContent.innerHTML += carrusel1 + carrusel2;
}

// Generador de plantillas HTML para un carrusel
function construirCarrusel(titulo, productos, id) {
    let tarjetasHTML = productos.map(prod => `
        <div class="card h-100 shadow-sm border-0 bg-light carousel-item-card">
            <img src="${prod.imagen}" class="card-img-top p-3 rounded" alt="${prod.nombre}" style="height: 180px; object-fit: contain;">
            <div class="card-body d-flex flex-column">
                <span class="badge bg-secondary mb-2 align-self-start">${prod.marca}</span>
                <h5 class="card-title fs-6 fw-bold text-truncate" title="${prod.nombre}">${prod.nombre}</h5>
                <div class="mt-auto d-flex justify-content-between align-items-center pt-3">
                    <span class="fs-5 fw-bold text-primary">${prod.precio.toFixed(2)} €</span>
                    <button class="btn btn-sm btn-success" onclick="agregarAlCarrito(${prod.id})" title="Añadir">
                        <i class="bi bi-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    return `
        <div class="mb-5">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="h5 fw-bold mb-0">${titulo}</h3>
                <a href="#catalogo" class="text-primary small text-decoration-none fw-semibold">Ver todo →</a>
            </div>
            
            <div class="position-relative">
                <button class="btn btn-outline-secondary shadow rounded-circle position-absolute start-0 top-50 translate-middle-y bg-white" 
                        onclick="desplazarCarrusel('${id}', -300)" 
                        style="width: 40px; height: 40px; z-index: 10;">
                    <i class="bi bi-chevron-left"></i>
                </button>
                
                <div id="${id}" class="carousel-track py-3 px-2">
                    ${tarjetasHTML}
                </div>
                
                <button class="btn btn-outline-secondary shadow rounded-circle position-absolute end-0 top-50 translate-middle-y bg-white" 
                        onclick="desplazarCarrusel('${id}', 300)" 
                        style="width: 40px; height: 40px; z-index: 10;">
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>
        </div>
    `;
}

// Función que mueve el scroll de un carrusel concreto
function desplazarCarrusel(idCarrusel, cantidadPixels) {
    const track = document.getElementById(idCarrusel);
    // Movemos el scroll nativo hacia la izquierda o derecha
    track.scrollBy({ left: cantidadPixels, behavior: 'smooth' });
}

// Manejador de la barra de búsqueda
function realizarBusqueda(evento) {
    evento.preventDefault(); // Evita que la página se recargue (comportamiento por defecto del form)
    const termino = document.getElementById("inputBusqueda").value;
    
    if(termino.trim() !== "") {
        alert("Buscando: " + termino + "\n(Pendiente de filtrar el array de productos)");
        // Aquí podrías redirigir a una vista de resultados o filtrar tu catálogo
    }
}

// Función para mostrar los resultados en vivo
function mostrarSugerencias(texto) {
    const caja = document.getElementById("cajaSugerencias");
    
    // Si el input está vacío, ocultamos la caja y salimos
    if (!texto || texto.trim().length === 0) {
        caja.innerHTML = "";
        caja.classList.add("d-none");
        return;
    }

    const termino = texto.toLowerCase().trim();
    
    // Filtramos el array buscando coincidencias en nombre o categoría
    const resultados = productosMock.filter(prod => 
        prod.nombre.toLowerCase().includes(termino) || 
        prod.categoria.toLowerCase().includes(termino)
    );

    // Si no hay resultados
    if (resultados.length === 0) {
        caja.innerHTML = `<div class="p-3 text-muted text-center">No se encontraron productos para "${texto}"</div>`;
        caja.classList.remove("d-none");
        return;
    }

    // Si hay resultados, construimos el HTML de cada línea
    const htmlSugerencias = resultados.map(prod => `
        <a href="#producto/${prod.id}" class="text-decoration-none text-dark d-flex align-items-center p-2 border-bottom result-hover" onclick="ocultarSugerencias()">
            <img src="${prod.imagen}" style="width: 50px; height: 50px; object-fit: contain;" class="me-3 rounded bg-light">
            <div class="flex-grow-1 overflow-hidden">
                <div class="fw-bold fs-6 text-truncate">${prod.nombre}</div>
                <div class="small text-muted">${prod.categoria}</div>
            </div>
            <div class="fw-bold text-primary ms-2">${prod.precio.toFixed(2)}€</div>
        </a>
    `).join('');

    caja.innerHTML = htmlSugerencias;
    caja.classList.remove("d-none");
}

function ocultarSugerencias() {
    const caja = document.getElementById("cajaSugerencias");
    caja.classList.add("d-none");
}

// Extra UX: Cerrar las sugerencias si el usuario hace clic fuera del buscador
document.addEventListener("click", (evento) => {
    const contenedor = document.getElementById("contenedorBusqueda");
    // Si el clic NO fue dentro del contenedor del buscador, ocultamos la caja
    if (contenedor && !contenedor.contains(evento.target)) {
        ocultarSugerencias();
    }
});



// Renderiza la vista de catálogo
function renderizarCatalogo() {
    const contenedorCatalogo = document.getElementById("catalogo");
    
    contenedorCatalogo.innerHTML = `
        <div class="container py-5">
            <h2 class="mb-4">Catálogo de Componentes de Red</h2>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4" id="grid-productos"></div>
        </div>
    `;

    const grid = document.getElementById("grid-productos");

    productosMock.forEach(prod => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "col";
        tarjeta.innerHTML = `
            <div class="card h-100 shadow-sm border-0 bg-light">
                <img src="${prod.imagen}" class="card-img-top p-2 rounded" alt="${prod.nombre}">
                <div class="card-body d-flex flex-column">
                    <div class="mb-2">
                        <span class="badge bg-secondary">${prod.marca}</span>
                        <span class="badge bg-info text-dark">${prod.categoria}</span>
                    </div>
                    <h5 class="card-title fs-6 fw-bold">${prod.nombre}</h5>
                    <p class="card-text text-muted small mb-3 flex-grow-1">${prod.descripcion.substring(0, 60)}...</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <span class="fs-5 fw-bold text-primary">${prod.precio.toFixed(2)} €</span>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-success" onclick="agregarAlCarrito(${prod.id})" title="Añadir al carrito">
                                <i class="bi bi-cart-plus"></i>
                            </button>
                            <a href="#producto/${prod.id}" class="btn btn-sm btn-primary">
                                Detalles
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(tarjeta);
    });
}

// Renderiza la vista de detalles
function renderizarDetalle(id) {
    const prod = productosMock.find(p => p.id === id);
    const contenedorProducto = document.getElementById("producto");
    
    if (!prod) {
        contenedorProducto.innerHTML = `<div class="container py-5"><h2>Producto no encontrado</h2></div>`;
        return;
    }

    const textoTweet = encodeURIComponent(`¡Mira este increíble ${prod.nombre} por solo ${prod.precio.toFixed(2)}€ en Telecom! 🚀`);
    const urlActual = encodeURIComponent(window.location.href);
    const enlaceTwitter = `https://twitter.com/intent/tweet?text=${textoTweet}&url=${urlActual}`;

    contenedorProducto.innerHTML = `
        <div class="container py-5">
            <button class="btn btn-link text-decoration-none mb-4 text-dark" onclick="window.location.hash='#catalogo'">
                <i class="bi bi-arrow-left"></i> Volver al catálogo
            </button>
            <div class="row">
                <div class="col-md-6 mb-4">
                    <img src="${prod.imagen}" class="img-fluid rounded shadow-sm w-100" alt="${prod.nombre}">
                </div>
                <div class="col-md-6">
                    <span class="badge bg-secondary mb-2">${prod.marca}</span>
                    <span class="badge bg-info text-dark mb-2">${prod.categoria}</span>
                    <h2 class="fw-bold">${prod.nombre}</h2>
                    <p class="fs-3 text-primary fw-bold mb-4">${prod.precio.toFixed(2)} €</p>
                    <p class="text-muted mb-4">${prod.descripcion}</p>
                    
                    <div class="d-grid gap-2 mb-5">
                        <button class="btn btn-success btn-lg" onclick="agregarAlCarrito(${prod.id})">
                            <i class="bi bi-cart-plus"></i> Añadir al Carrito
                        </button>
                    </div>

                    <div class="mt-4 pt-4 border-top">
                        <p class="fw-bold mb-3"><i class="bi bi-share"></i> Compartir este producto:</p>
                        <a href="#" class="btn btn-outline-primary btn-sm me-2 mb-2">
                            <i class="bi bi-facebook"></i> Compartir en Facebook
                        </a>
                        <a href="${enlaceTwitter}" target="_blank" class="btn btn-outline-info btn-sm me-2 mb-2">
                            <i class="bi bi-twitter-x"></i> Twittear
                        </a>
                        <a href="#" class="btn btn-outline-success btn-sm mb-2">
                            <i class="bi bi-whatsapp"></i> Enviar por WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Renderiza los formularios de autenticación
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
                            <form onsubmit="event.preventDefault(); alert('Login válido. Pendiente de conexión con Backend para generar la sesión.');">
                                <div class="mb-3">
                                    <label class="form-label text-muted small">Correo electrónico</label>
                                    <input type="email" class="form-control" placeholder="ejemplo@correo.com" required>
                                </div>
                                <div class="mb-4">
                                    <label class="form-label text-muted small">Contraseña</label>
                                    <input type="password" class="form-control" placeholder="••••••••" required>
                                </div>
                                <button type="submit" class="btn btn-primary w-100 mb-4">Entrar</button>
                            </form>
                            
                            <div class="d-flex align-items-center mb-4">
                                <hr class="flex-grow-1">
                                <span class="mx-2 text-muted small">O iniciar sesión con</span>
                                <hr class="flex-grow-1">
                            </div>
                            
                            <div class="d-grid gap-3">
                                <button class="btn btn-outline-danger d-flex align-items-center justify-content-center" type="button">
                                    <i class="bi bi-google me-2 fs-5"></i> Continuar con Google
                                </button>
                                <button class="btn btn-outline-primary d-flex align-items-center justify-content-center" type="button">
                                    <i class="bi bi-facebook me-2 fs-5"></i> Continuar con Facebook
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-5">
                    <div class="card shadow-sm h-100 bg-light border-0">
                        <div class="card-body p-4">
                            <h4 class="card-title mb-4">Crear una cuenta nueva</h4>
                            <p class="text-muted small mb-4">Regístrate para poder gestionar el estado de tus pedidos y revisar tu histórico.</p>
                            
                            <form onsubmit="event.preventDefault(); alert('Registro válido en Frontend. Pasando datos al Backend...');">
                                <div class="mb-3">
                                    <label class="form-label text-muted small">Nombre completo</label>
                                    <input type="text" class="form-control" placeholder="Nombre completo" minlength="3" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-muted small">Correo electrónico</label>
                                    <input type="email" class="form-control" placeholder="ejemplo@correo.com" required>
                                </div>
                                <div class="mb-4">
                                    <label class="form-label text-muted small">Contraseña</label>
                                    <input type="password" class="form-control" placeholder="Crea una contraseña segura" 
                                           pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
                                           title="Debe contener al menos 8 caracteres, un número, una mayúscula y una minúscula" 
                                           required>
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

// Gestión del estado del carrito
function agregarAlCarrito(id) {
    const producto = productosMock.find(p => p.id === id);
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

// Modificación de cantidades dinámicas
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

// Renderiza la interfaz dinámica del carrito
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

    const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
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
                <td class="text-end fw-semibold">${(item.precio * item.cantidad).toFixed(2)} €</td>
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
}

// Controlador de la acción de pago
function procesarPago() {
    alert("Para procesar el pago y guardar el pedido en tu historial, el servidor debe validar tu sesión de usuario. Pendiente de integración con Backend.");
    window.location.hash = "#login";
}