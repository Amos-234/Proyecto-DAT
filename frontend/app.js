// 1. DATOS SIMULADOS (Mock Data)
const productosMock = [
    { id: 1, nombre: "Switch Cisco Catalyst 2960", marca: "Cisco", categoria: "Switches", precio: 250.00, imagen: "https://via.placeholder.com/600x400?text=Switch+Cisco", descripcion: "Switch de 24 puertos Gigabit, ideal para pequeñas y medianas empresas. Alta fiabilidad y rendimiento." },
    { id: 2, nombre: "Router Ubiquiti EdgeRouter 4", marca: "Ubiquiti", categoria: "Routers", precio: 199.00, imagen: "https://via.placeholder.com/600x400?text=Router+Ubiquiti", descripcion: "Router avanzado de 4 puertos con gran capacidad de procesamiento. Millones de paquetes por segundo." },
    { id: 3, nombre: "Cable de Fibra Óptica LC-LC 5m", marca: "Genérico", categoria: "Cableado", precio: 15.50, imagen: "https://via.placeholder.com/600x400?text=Cable+Fibra", descripcion: "Latiguillo de fibra óptica multimodo OM3 dúplex. Perfecto para conexiones de alta velocidad." },
    { id: 4, nombre: "Access Point Aruba 515", marca: "Aruba", categoria: "Inalámbrico", precio: 320.00, imagen: "https://via.placeholder.com/600x400?text=Aruba+AP", descripcion: "Punto de acceso WiFi 6 de alto rendimiento para entornos de alta densidad de usuarios." }
];

document.addEventListener("DOMContentLoaded", () => {
    
    // 2. ENRUTADOR INTELIGENTE DE LA SPA
    const enrutador = () => {
        const hash = window.location.hash || "#home";
        
        // Ocultamos todas las secciones primero
        const secciones = document.querySelectorAll("main > section");
        secciones.forEach(seccion => seccion.style.display = "none");

        // --- NUEVA LÓGICA PARA DETALLE DE PRODUCTO DINÁMICO ---
        // Comprobamos si la URL empieza por "#producto/" (ej: #producto/2)
        if (hash.startsWith("#producto/")) {
            // Dividimos el hash por la barra "/" y nos quedamos con la segunda parte (el ID)
            const partes = hash.split("/");
            const productoId = parseInt(partes[1]); // Convertimos el texto "2" en número 2
            
            // Mostramos la sección de producto y cargamos sus datos
            document.getElementById("producto").style.display = "block";
            renderizarDetalle(productoId);
            return; // Salimos de la función enrutador para que no ejecute el código de abajo
        }
        // ------------------------------------------------------

        // Navegación normal para el resto de pestañas fijas (#home, #catalogo, etc.)
        const seccionActiva = document.querySelector(hash);
        if (seccionActiva) {
            seccionActiva.style.display = "block";
        }

        if (hash === "#catalogo") {
            renderizarCatalogo();
        }
    };

    window.addEventListener("hashchange", enrutador);
    enrutador();
});

// 3. FUNCIÓN PARA PINTAR EL CATÁLOGO
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

// 4. FUNCIÓN PARA PINTAR EL DETALLE DEL PRODUCTO
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
                        <button class="btn btn-success btn-lg" onclick="alert('Añadiendo al carrito (Simulado)')">
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