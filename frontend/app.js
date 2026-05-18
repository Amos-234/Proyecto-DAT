// 1. DATOS SIMULADOS (Mock Data)
// Cumplimos con la premisa de tener categorías y marcas preparadas para los futuros filtros
const productosMock = [
    { id: 1, nombre: "Switch Cisco Catalyst 2960", marca: "Cisco", categoria: "Switches", precio: 250.00, imagen: "https://via.placeholder.com/300x200?text=Switch+Cisco", descripcion: "Switch de 24 puertos Gigabit, ideal para pequeñas y medianas empresas." },
    { id: 2, nombre: "Router Ubiquiti EdgeRouter 4", marca: "Ubiquiti", categoria: "Routers", precio: 199.00, imagen: "https://via.placeholder.com/300x200?text=Router+Ubiquiti", descripcion: "Router avanzado de 4 puertos con gran capacidad de procesamiento." },
    { id: 3, nombre: "Cable de Fibra Óptica LC-LC 5m", marca: "Genérico", categoria: "Cableado", precio: 15.50, imagen: "https://via.placeholder.com/300x200?text=Cable+Fibra", descripcion: "Latiguillo de fibra óptica multimodo OM3 dúplex." },
    { id: 4, nombre: "Access Point Aruba 515", marca: "Aruba", categoria: "Inalámbrico", precio: 320.00, imagen: "https://via.placeholder.com/300x200?text=Aruba+AP", descripcion: "Punto de acceso WiFi 6 de alto rendimiento para entornos de alta densidad." }
];

document.addEventListener("DOMContentLoaded", () => {
    
    // 2. ENRUTADOR DE LA SPA
    const enrutador = () => {
        const hash = window.location.hash || "#home";
        const secciones = document.querySelectorAll("main > section");

        secciones.forEach(seccion => {
            if (`#${seccion.id}` === hash) {
                seccion.style.display = "block";
            } else {
                seccion.style.display = "none";
            }
        });

        // 3. LÓGICA POR SECCIÓN
        // Si entramos al catálogo, llamamos a la función que pinta los productos
        if (hash === "#catalogo") {
            renderizarCatalogo();
        }
    };

    window.addEventListener("hashchange", enrutador);
    enrutador();
});

// 4. FUNCIÓN PARA PINTAR EL CATÁLOGO
function renderizarCatalogo() {
    const contenedorCatalogo = document.getElementById("catalogo");
    
    // Inyectamos la estructura base del contenedor de Bootstrap
    contenedorCatalogo.innerHTML = `
        <div class="container py-5">
            <h2 class="mb-4">Catálogo de Componentes de Red</h2>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4" id="grid-productos"></div>
        </div>
    `;

    const grid = document.getElementById("grid-productos");

    // Recorremos el array de productos y creamos una tarjeta (Card) para cada uno
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
                    <p class="card-text text-muted small mb-3 flex-grow-1">${prod.descripcion}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <span class="fs-5 fw-bold text-primary">${prod.precio.toFixed(2)} €</span>
                        <button class="btn btn-sm btn-outline-primary" onclick="alert('Añadido al carrito: ${prod.nombre}')">
                            <i class="bi bi-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(tarjeta);
    });
}