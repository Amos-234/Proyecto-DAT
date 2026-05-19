// Mock de datos para desarrollo del Frontend (50 productos)
const productosMock = [
    { id: 1, nombre: "Switch Cisco Catalyst 2960-X 24 GigE", marca: "Cisco", categoria: "Switches", precio: 390.00, precioOriginal: 450.00, imagen: "https://via.placeholder.com/600x400?text=Cisco+Catalyst+2960", descripcion: "Switch gestionable de 24 puertos Gigabit con 4 enlaces ascendentes SFP. Ideal para acceso empresarial." },
    { id: 2, nombre: "Ubiquiti UniFi Switch 24 PoE", marca: "Ubiquiti", categoria: "Switches", precio: 379.99, imagen: "https://via.placeholder.com/600x400?text=UniFi+Switch+24", descripcion: "Switch PoE+ de 24 puertos con refrigeración silenciosa y gestión centralizada UniFi." },
    { id: 3, nombre: "MikroTik Cloud Router Switch 326", marca: "MikroTik", categoria: "Switches", precio: 150.00, precioOriginal: 185.50, imagen: "https://via.placeholder.com/600x400?text=MikroTik+CRS326", descripcion: "Switch de 24 puertos Gigabit Ethernet y 2 puertos SFP+ para conectividad 10G." },
    { id: 4, nombre: "TP-Link JetStream 16-Port Gigabit", marca: "TP-Link", categoria: "Switches", precio: 120.00, imagen: "https://via.placeholder.com/600x400?text=TP-Link+JetStream", descripcion: "Switch Smart Managed ideal para pymes con opciones avanzadas de VLAN y QoS." },
    { id: 5, nombre: "Switch Aruba Instant On 1930 48G", marca: "Aruba", categoria: "Switches", precio: 450.00, precioOriginal: 510.00, imagen: "https://via.placeholder.com/600x400?text=Aruba+1930+48G", descripcion: "Switch de 48 puertos Gigabit gestionado por nube para pequeñas empresas." },
    { id: 6, nombre: "Netgear ProSAFE 8-Port Gigabit", marca: "Netgear", categoria: "Switches", precio: 45.00, imagen: "https://via.placeholder.com/600x400?text=Netgear+ProSAFE+8", descripcion: "Switch no gestionable Plug-and-Play de carcasa metálica." },
    { id: 7, nombre: "Cisco Nexus 93180YC-EX", marca: "Cisco", categoria: "Switches", precio: 4500.00, imagen: "https://via.placeholder.com/600x400?text=Cisco+Nexus", descripcion: "Switch de centro de datos de ultra baja latencia con 48 puertos 10/25G." },
    { id: 8, nombre: "Ubiquiti EdgeSwitch 10XP", marca: "Ubiquiti", categoria: "Switches", precio: 110.00, precioOriginal: 135.00, imagen: "https://via.placeholder.com/600x400?text=EdgeSwitch+10XP", descripcion: "Switch PoE de 8 puertos Gigabit diseñado para implementaciones WISP." },
    { id: 9, nombre: "Router Ubiquiti EdgeRouter 4", marca: "Ubiquiti", categoria: "Routers", precio: 199.00, imagen: "https://via.placeholder.com/600x400?text=EdgeRouter+4", descripcion: "Router avanzado con capacidad de enrutamiento de 3.4 millones de paquetes por segundo." },
    { id: 10, nombre: "MikroTik hEX RB750Gr3", marca: "MikroTik", categoria: "Routers", precio: 45.00, precioOriginal: 59.90, imagen: "https://via.placeholder.com/600x400?text=MikroTik+hEX", descripcion: "Pequeño router de 5 puertos Gigabit con cifrado IPsec por hardware." },
    { id: 11, nombre: "Cisco ISR 4321", marca: "Cisco", categoria: "Routers", precio: 850.00, imagen: "https://via.placeholder.com/600x400?text=Cisco+ISR+4321", descripcion: "Router de servicios integrados para sucursales corporativas." },
    { id: 12, nombre: "TP-Link Omada ER605", marca: "TP-Link", categoria: "Routers", precio: 55.00, precioOriginal: 65.00, imagen: "https://via.placeholder.com/600x400?text=Omada+ER605", descripcion: "Router VPN Gigabit Multi-WAN seguro y gestionable por software." },
    { id: 13, nombre: "Ubiquiti UniFi Dream Machine Pro", marca: "Ubiquiti", categoria: "Routers", precio: 410.00, imagen: "https://via.placeholder.com/600x400?text=UDM+Pro", descripcion: "Gateway de seguridad empresarial todo en uno y controlador de red." },
    { id: 14, nombre: "MikroTik CCR1009-7G-1C", marca: "MikroTik", categoria: "Routers", precio: 380.00, precioOriginal: 450.00, imagen: "https://via.placeholder.com/600x400?text=MikroTik+CCR1009", descripcion: "Cloud Core Router de grado industrial con CPU de 9 núcleos." },
    { id: 15, nombre: "Cisco Meraki MX64", marca: "Cisco", categoria: "Routers", precio: 520.00, imagen: "https://via.placeholder.com/600x400?text=Meraki+MX64", descripcion: "Appliance de seguridad y SD-WAN gestionado en la nube al 100%." },
    { id: 16, nombre: "Fortinet FortiGate 40F", marca: "Fortinet", categoria: "Firewalls", precio: 480.00, imagen: "https://via.placeholder.com/600x400?text=FortiGate+40F", descripcion: "Appliance NGFW (Next-Generation Firewall) ideal para oficinas remotas." },
    { id: 17, nombre: "Palo Alto Networks PA-410", marca: "Palo Alto", categoria: "Firewalls", precio: 850.00, precioOriginal: 950.00, imagen: "https://via.placeholder.com/600x400?text=Palo+Alto+PA-410", descripcion: "Firewall con machine learning integrado para prevenir amenazas de día cero." },
    { id: 18, nombre: "Sophos XGS 116", marca: "Sophos", categoria: "Firewalls", precio: 580.00, precioOriginal: 620.00, imagen: "https://via.placeholder.com/600x400?text=Sophos+XGS+116", descripcion: "Protección perimetral avanzada con arquitectura Xstream." },
    { id: 19, nombre: "Cisco Firepower 1010", marca: "Cisco", categoria: "Firewalls", precio: 780.00, imagen: "https://via.placeholder.com/600x400?text=Firepower+1010", descripcion: "Defensa contra amenazas superior orientada a Pymes." },
    { id: 20, nombre: "Fortinet FortiGate 60F", marca: "Fortinet", categoria: "Firewalls", precio: 750.00, imagen: "https://via.placeholder.com/600x400?text=FortiGate+60F", descripcion: "Firewall de alto rendimiento con SD-WAN segura." },
    { id: 21, nombre: "WatchGuard Firebox T20", marca: "Genérico", categoria: "Firewalls", precio: 290.00, precioOriginal: 340.00, imagen: "https://via.placeholder.com/600x400?text=WatchGuard+T20", descripcion: "Seguridad de red de nivel empresarial para pequeñas oficinas." },
    { id: 22, nombre: "Ubiquiti UniFi AP AC Pro", marca: "Ubiquiti", categoria: "Access Points", precio: 145.00, imagen: "https://via.placeholder.com/600x400?text=UniFi+AC+Pro", descripcion: "Punto de acceso dual-band 802.11ac para interiores y exteriores." },
    { id: 23, nombre: "Aruba Instant On AP22", marca: "Aruba", categoria: "Access Points", precio: 165.00, imagen: "https://via.placeholder.com/600x400?text=Aruba+AP22", descripcion: "Access Point Wi-Fi 6 (802.11ax) de alto rendimiento." },
    { id: 24, nombre: "Cisco Meraki MR46", marca: "Cisco", categoria: "Access Points", precio: 790.00, precioOriginal: 890.00, imagen: "https://via.placeholder.com/600x400?text=Meraki+MR46", descripcion: "AP Wi-Fi 6 gestionado en la nube, optimizado para alta densidad." },
    { id: 25, nombre: "TP-Link Omada EAP225", marca: "TP-Link", categoria: "Access Points", precio: 65.00, imagen: "https://via.placeholder.com/600x400?text=Omada+EAP225", descripcion: "Punto de acceso de montaje en techo Gigabit Inalámbrico MU-MIMO." },
    { id: 26, nombre: "Ubiquiti UniFi U6 Lite", marca: "Ubiquiti", categoria: "Access Points", precio: 99.00, precioOriginal: 110.00, imagen: "https://via.placeholder.com/600x400?text=UniFi+U6+Lite", descripcion: "Punto de acceso Wi-Fi 6 compacto para despliegues masivos." },
    { id: 27, nombre: "MikroTik cAP ac", marca: "MikroTik", categoria: "Access Points", precio: 75.00, imagen: "https://via.placeholder.com/600x400?text=MikroTik+cAP", descripcion: "AP de doble banda que pasa desapercibido en el techo." },
    { id: 28, nombre: "Aruba AP-515", marca: "Aruba", categoria: "Access Points", precio: 450.00, imagen: "https://via.placeholder.com/600x400?text=Aruba+AP-515", descripcion: "AP de campus de alto rendimiento para entornos móviles e IoT." },
    { id: 29, nombre: "Netgear WAX610", marca: "Netgear", categoria: "Access Points", precio: 125.00, precioOriginal: 155.00, imagen: "https://via.placeholder.com/600x400?text=Netgear+WAX610", descripcion: "Punto de acceso Insight Managed WiFi 6 AX1800." },
    { id: 30, nombre: "Ubiquiti LiteBeam 5AC Gen2", marca: "Ubiquiti", categoria: "Antenas", precio: 65.00, imagen: "https://via.placeholder.com/600x400?text=LiteBeam+5AC", descripcion: "CPE airMAX ac ultra ligero de largo alcance y alta directividad." },
    { id: 31, nombre: "MikroTik SXTsq Lite5", marca: "MikroTik", categoria: "Antenas", precio: 39.00, precioOriginal: 49.00, imagen: "https://via.placeholder.com/600x400?text=SXTsq+Lite5", descripcion: "Dispositivo inalámbrico compacto para enlaces punto a punto o como CPE." },
    { id: 32, nombre: "Ubiquiti NanoStation Loco M5", marca: "Ubiquiti", categoria: "Antenas", precio: 55.00, imagen: "https://via.placeholder.com/600x400?text=NanoStation+M5", descripcion: "CPE versátil y de bajo coste para redes ISP inalámbricas." },
    { id: 33, nombre: "Ubiquiti airFiber 5XHD", marca: "Ubiquiti", categoria: "Antenas", precio: 420.00, imagen: "https://via.placeholder.com/600x400?text=airFiber+5XHD", descripcion: "Radio de backhaul de 5 GHz diseñada específicamente para WISP." },
    { id: 34, nombre: "MikroTik LDF 5", marca: "MikroTik", categoria: "Antenas", precio: 45.00, imagen: "https://via.placeholder.com/600x400?text=MikroTik+LDF+5", descripcion: "Sistema inalámbrico con antena parabólica para enlaces extremadamente largos." },
    { id: 35, nombre: "TP-Link CPE510", marca: "TP-Link", categoria: "Antenas", precio: 40.00, precioOriginal: 48.00, imagen: "https://via.placeholder.com/600x400?text=TP-Link+CPE510", descripcion: "CPE Inalámbrico de Exterior a 5GHz 300Mbps 13dBi." },
    { id: 36, nombre: "Bobina Cable UTP Cat6 305m", marca: "Genérico", categoria: "Cableado", precio: 75.00, precioOriginal: 95.00, imagen: "https://via.placeholder.com/600x400?text=Bobina+Cat6", descripcion: "Cable de par trenzado sin apantallar de cobre 100% puro." },
    { id: 37, nombre: "Bobina Cable FTP Cat6a 305m", marca: "Genérico", categoria: "Cableado", precio: 145.00, imagen: "https://via.placeholder.com/600x400?text=Bobina+Cat6a", descripcion: "Cable apantallado para redes de 10 Gigabit, alta resistencia a interferencias." },
    { id: 38, nombre: "Latiguillo Fibra Óptica LC-LC 5m", marca: "Genérico", categoria: "Cableado", precio: 15.50, imagen: "https://via.placeholder.com/600x400?text=Fibra+OM3", descripcion: "Latiguillo de fibra multimodo dúplex 50/125 OM3." },
    { id: 39, nombre: "Latiguillo Fibra SC-APC 10m", marca: "Genérico", categoria: "Cableado", precio: 9.00, precioOriginal: 12.00, imagen: "https://via.placeholder.com/600x400?text=Fibra+SC-APC", descripcion: "Latiguillo monomodo ideal para instalaciones de fibra óptica hasta el hogar (FTTH)." },
    { id: 40, nombre: "Cable DAC SFP+ 10G 1m", marca: "Cisco", categoria: "Cableado", precio: 35.00, imagen: "https://via.placeholder.com/600x400?text=Cable+DAC", descripcion: "Cable Twinax de conexión directa (DAC) para enlaces de cortísima distancia." },
    { id: 41, nombre: "Pack 10 Latiguillos UTP Cat6 1m", marca: "Genérico", categoria: "Cableado", precio: 18.00, imagen: "https://via.placeholder.com/600x400?text=Pack+Latiguillos", descripcion: "Latiguillos de red RJ45 en varios colores para parcheo de armarios." },
    { id: 42, nombre: "Armario Rack Mural 19\" 9U", marca: "Genérico", categoria: "Racks", precio: 85.00, imagen: "https://via.placeholder.com/600x400?text=Rack+Mural+9U", descripcion: "Armario de pared perfecto para pequeñas instalaciones de red o CCTV." },
    { id: 43, nombre: "Armario Rack Suelo 19\" 42U", marca: "Genérico", categoria: "Racks", precio: 390.00, precioOriginal: 450.00, imagen: "https://via.placeholder.com/600x400?text=Rack+42U", descripcion: "Armario de pie para servidores y equipamiento de red pesado, con ventilación." },
    { id: 44, nombre: "Bandeja Fija Rack 19\" 1U", marca: "Genérico", categoria: "Racks", precio: 22.00, imagen: "https://via.placeholder.com/600x400?text=Bandeja+Rack", descripcion: "Bandeja perforada para soportar routers no enrackables o monitores." },
    { id: 45, nombre: "Regleta PDU 8 Tomas Rack 19\"", marca: "Genérico", categoria: "Racks", precio: 35.00, imagen: "https://via.placeholder.com/600x400?text=Regleta+PDU", descripcion: "Unidad de distribución de energía con interruptor para armarios." },
    { id: 46, nombre: "Panel de Parcheo 24 Puertos Cat6", marca: "Genérico", categoria: "Racks", precio: 30.00, precioOriginal: 45.00, imagen: "https://via.placeholder.com/600x400?text=Patch+Panel", descripcion: "Patch panel vacío para inserción de módulos Keystone (Jack)." },
    { id: 47, nombre: "GuíaCables 1U con Tapa", marca: "Genérico", categoria: "Racks", precio: 15.00, imagen: "https://via.placeholder.com/600x400?text=GuiaCables", descripcion: "Organizador de cables frontal para un armario rack más ordenado." },
    { id: 48, nombre: "Módulo SFP 1G Base-T Cobre", marca: "Ubiquiti", categoria: "Accesorios", precio: 25.00, imagen: "https://via.placeholder.com/600x400?text=SFP+Cobre", descripcion: "Transceptor SFP a RJ45 para distancias de hasta 100m." },
    { id: 49, nombre: "Módulo SFP+ 10G SR Multimodo", marca: "Cisco", categoria: "Accesorios", precio: 75.00, precioOriginal: 95.00, imagen: "https://via.placeholder.com/600x400?text=SFP%2B+10G", descripcion: "Transceptor óptico para cortas distancias (hasta 300m sobre fibra OM3)." },
    { id: 50, nombre: "Inyector PoE+ 30W Gigabit", marca: "TP-Link", categoria: "Accesorios", precio: 22.00, imagen: "https://via.placeholder.com/600x400?text=Inyector+PoE", descripcion: "Inyector de energía a través de Ethernet para alimentar APs y cámaras." }
];

// Estado global del carrito
let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
    // Controlador principal de navegación (SPA Router)
    const enrutador = () => {
        const hash = window.location.hash || "#home";
        
        const secciones = document.querySelectorAll("main > section");
        secciones.forEach(seccion => seccion.style.display = "none");

        // CAPTURAMOS EL FOOTER
        const footer = document.getElementById("footer-principal");

        // Lógica para la vista de detalles de producto
        if (hash.startsWith("#producto/")) {
            document.getElementById("producto").style.display = "block";
            if (footer) footer.style.display = "none"; // Ocultar en detalles
            const partes = hash.split("/");
            const productoId = parseInt(partes[1]); 
            renderizarDetalle(productoId);
            return; 
        }

        const seccionActiva = document.querySelector(hash);
        if (seccionActiva) {
            seccionActiva.style.display = "block";
        }

        // CONTROL DE VISIBILIDAD DEL FOOTER
        if (hash === "#home" || hash === "") {
            if (footer) footer.style.display = "block"; // Mostrar solo en el Home
            renderizarHome();
        } else {
            if (footer) footer.style.display = "none";  // Ocultar en cualquier otra sección
        }

        // Resto de tus condiciones de renderizado
        if (hash === "#catalogo") { renderizarCatalogo(); }
        if (hash === "#login") { renderizarLogin(); }
        if (hash === "#carrito") { renderizarCarrito(); }
    };

    window.addEventListener("hashchange", enrutador);
    enrutador();
});

// Genera la tarjeta y calcula el descuento
function generarTarjetaProducto(prod, esCarrusel = false) {
    let etiquetaOferta = '';
    let uiPrecio = `<span class="fs-5 fw-bold text-primary">${prod.precio.toFixed(2)} €</span>`;

    if (prod.precioOriginal && prod.precioOriginal > prod.precio) {
        const porcentajeDescuento = Math.round(((prod.precioOriginal - prod.precio) / prod.precioOriginal) * 100);
        etiquetaOferta = `<span class="badge bg-danger position-absolute top-0 start-0 m-2">-${porcentajeDescuento}% Dto.</span>`;
        uiPrecio = `<span class="text-muted text-decoration-line-through small me-2">${prod.precioOriginal.toFixed(2)} €</span><span class="fs-5 fw-bold text-danger">${prod.precio.toFixed(2)} €</span>`;
    }

    const anchoEstilo = esCarrusel ? 'style="min-width: 280px; max-width: 280px;"' : '';

    return `
        <div class="card h-100 shadow-sm border-0 bg-light" ${anchoEstilo}>
            ${etiquetaOferta}
            <img src="${prod.imagen}" class="card-img-top p-2 rounded" alt="${prod.nombre}">
            <div class="card-body d-flex flex-column">
                <div class="mb-2">
                    <span class="badge bg-secondary">${prod.marca}</span>
                    <span class="badge bg-info text-dark">${prod.categoria}</span>
                </div>
                <h5 class="card-title fs-6 fw-bold">${prod.nombre}</h5>
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

// Renderiza los carruseles del Home
function renderizarHome() {
    const destacados = productosMock.slice(0, 6);
    document.getElementById("trackDestacados").innerHTML = destacados.map(p => generarTarjetaProducto(p, true)).join('');

    const novedades = productosMock.slice(6, 12);
    document.getElementById("trackNovedades").innerHTML = novedades.map(p => generarTarjetaProducto(p, true)).join('');

    const ofertas = productosMock.filter(p => p.precioOriginal && p.precioOriginal > p.precio).slice(0, 8);
    document.getElementById("trackOfertas").innerHTML = ofertas.map(p => generarTarjetaProducto(p, true)).join('');
}

// -- LÓGICA DE BÚSQUEDA INTERACTIVA --
function mostrarSugerencias(texto) {
    const caja = document.getElementById("cajaSugerencias");
    if (!texto || texto.trim().length === 0) {
        caja.innerHTML = "";
        caja.classList.add("d-none");
        return;
    }

    const termino = texto.toLowerCase().trim();
    const resultados = productosMock.filter(prod => 
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
            <div class="fw-bold text-primary ms-2">${prod.precio.toFixed(2)}€</div>
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

// NUEVA FUNCIÓN: Al pulsar Enter en el buscador
function realizarBusqueda(event) {
    event.preventDefault(); // Evita que la página se recargue por defecto
    const input = document.getElementById("inputBusqueda");
    const texto = input.value.toLowerCase().trim();
    
    ocultarSugerencias();
    window.location.hash = "#catalogo"; // Viajamos al catálogo

    // Un pequeño retardo para asegurar que el DOM del catálogo se ha pintado
    setTimeout(() => {
        if(texto !== "") {
            // Reutilizamos renderizarCatalogo pero forzando un filtrado manual por texto
            const contenedorCatalogo = document.getElementById("catalogo");
            const resultados = productosMock.filter(prod => 
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
                grid.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted fs-5">Vaya, no hemos encontrado nada. Prueba con "Cisco" o "Router".</p></div>`;
            } else {
                grid.innerHTML = resultados.map(p => `<div class="col">${generarTarjetaProducto(p, false)}</div>`).join('');
            }
        }
    }, 50);
}

// Renderiza el Catálogo 
function renderizarCatalogo(filtro = "Todos") {
    const contenedorCatalogo = document.getElementById("catalogo");
    const categoriasIneditas = ["Todos", ...new Set(productosMock.map(p => p.categoria))];

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
    const productosFiltrados = filtro === "Todos" ? productosMock : productosMock.filter(prod => prod.categoria === filtro);

    if (productosFiltrados.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted fs-5">No hay productos en esta categoría.</p></div>`;
        return;
    }

    grid.innerHTML = productosFiltrados.map(p => `<div class="col">${generarTarjetaProducto(p, false)}</div>`).join('');
}

// Renderiza el detalle del producto
function renderizarDetalle(id) {
    const prod = productosMock.find(p => p.id === id);
    const contenedorProducto = document.getElementById("producto");
    
    if (!prod) {
        contenedorProducto.innerHTML = `<div class="container py-5"><h2>Producto no encontrado</h2></div>`;
        return;
    }

    let uiPrecioGrande = `<span class="fs-2 text-primary fw-bold">${prod.precio.toFixed(2)} €</span>`;
    let badgeOfertaDetalle = '';

    if (prod.precioOriginal && prod.precioOriginal > prod.precio) {
        const porcentajeDescuento = Math.round(((prod.precioOriginal - prod.precio) / prod.precioOriginal) * 100);
        uiPrecioGrande = `<span class="text-muted text-decoration-line-through fs-4 me-3">${prod.precioOriginal.toFixed(2)} €</span><span class="fs-2 fw-bold text-danger">${prod.precio.toFixed(2)} €</span>`;
        badgeOfertaDetalle = `<span class="badge bg-danger mb-2 ms-2">¡-${porcentajeDescuento}% de Descuento!</span>`;
    }

    const textoTweet = encodeURIComponent(`¡Mira este increíble ${prod.nombre} por solo ${prod.precio.toFixed(2)}€ en Telecom! 🚀`);
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

// Lógica de Carrito
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

function procesarPago() {
    alert("Para procesar el pago y guardar el pedido en tu historial, el servidor debe validar tu sesión de usuario. Pendiente de integración con Backend.");
    window.location.hash = "#login";
}