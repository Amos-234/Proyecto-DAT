// Mock de datos para desarrollo del Frontend. 
// Pendiente de sustitución por peticiones asíncronas (fetch) a la API REST.
const productosMock = [
    { id: 1, nombre: "Switch Cisco Catalyst 2960", marca: "Cisco", categoria: "Switches", precio: 250.00, imagen: "https://via.placeholder.com/600x400?text=Switch+Cisco", descripcion: "Switch de 24 puertos Gigabit, ideal para pequeñas y medianas empresas. Alta fiabilidad y rendimiento." },
    { id: 2, nombre: "Router Ubiquiti EdgeRouter 4", marca: "Ubiquiti", categoria: "Routers", precio: 199.00, imagen: "https://via.placeholder.com/600x400?text=Router+Ubiquiti", descripcion: "Router avanzado de 4 puertos con gran capacidad de procesamiento. Millones de paquetes por segundo." },
    { id: 3, nombre: "Cable de Fibra Óptica LC-LC 5m", marca: "Genérico", categoria: "Cableado", precio: 15.50, imagen: "https://via.placeholder.com/600x400?text=Cable+Fibra", descripcion: "Latiguillo de fibra óptica multimodo OM3 dúplex. Perfecto para conexiones de alta velocidad." },
    { id: 4, nombre: "Access Point Aruba 515", marca: "Aruba", categoria: "Inalámbrico", precio: 320.00, imagen: "https://via.placeholder.com/600x400?text=Aruba+AP", descripcion: "Punto de acceso WiFi 6 de alto rendimiento para entornos de alta densidad de usuarios." }
];

document.addEventListener("DOMContentLoaded", () => {
    
    // Controlador principal de navegación (SPA Router)
    const enrutador = () => {
        const hash = window.location.hash || "#home";
        
        // Reinicio del estado de las vistas
        const secciones = document.querySelectorAll("main > section");
        secciones.forEach(seccion => seccion.style.display = "none");

        // Gestión de rutas dinámicas (Ej: #producto/id)
        if (hash.startsWith("#producto/")) {
            const partes = hash.split("/");
            const productoId = parseInt(partes[1]); 
            
            document.getElementById("producto").style.display = "block";
            renderizarDetalle(productoId);
            return; 
        }

        // Gestión de rutas estáticas
        const seccionActiva = document.querySelector(hash);
        if (seccionActiva) {
            seccionActiva.style.display = "block";
        }

        // Inicialización de componentes por vista
        if (hash === "#catalogo") {
            renderizarCatalogo();
        }
        
        if (hash === "#login") {
            renderizarLogin();
        }
    };

    // Listeners de navegación
    window.addEventListener("hashchange", enrutador);
    enrutador();
});

// Renderiza la vista de catálogo iterando sobre el origen de datos
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
                        <a href="#producto/${prod.id}" class="btn btn-sm btn-primary">
                            Ver detalles
                        </a>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(tarjeta);
    });
}

// Renderiza la vista de detalle de un producto y su integración con RRSS
function renderizarDetalle(id) {
    const prod = productosMock.find(p => p.id === id);
    const contenedorProducto = document.getElementById("producto");
    
    if (!prod) {
        contenedorProducto.innerHTML = `<div class="container py-5"><h2>Producto no encontrado</h2></div>`;
        return;
    }

    // Preparación de Web Intents para APIs sociales (Twitter/X)
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
                        <button class="btn btn-success btn-lg" onclick="alert('Funcionalidad de carrito pendiente de implementación')">
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

// Renderiza los formularios de autenticación (Login/Registro) con validación Frontend
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
                            <form onsubmit="event.preventDefault(); alert('Login válido. Pendiente de conexión con Backend');">
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
                                <button class="btn btn-outline-danger d-flex align-items-center justify-content-center" type="button" onclick="alert('Integración Google OAuth pendiente')">
                                    <i class="bi bi-google me-2 fs-5"></i> Continuar con Google
                                </button>
                                <button class="btn btn-outline-primary d-flex align-items-center justify-content-center" type="button" onclick="alert('Integración Facebook OAuth pendiente')">
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
                            <p class="text-muted small mb-4">Regístrate para poder gestionar el estado de tus pedidos de componentes de red y revisar tu histórico.</p>
                            
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
                                    <div class="form-text small text-secondary mt-2">
                                        <i class="bi bi-info-circle"></i> Mínimo 8 caracteres, incluyendo una mayúscula y un número.
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