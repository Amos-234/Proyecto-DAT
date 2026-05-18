document.addEventListener("DOMContentLoaded", () => {
    
    // Función encargada de mostrar la sección activa y ocultar las demás
    const enrutador = () => {
        // Si no hay hash (ej. la primera vez que entras), por defecto vamos a #home
        const hash = window.location.hash || "#home";
        
        // Seleccionamos todas las secciones dentro del <main>
        const secciones = document.querySelectorAll("main > section");

        secciones.forEach(seccion => {
            // Si el ID de la sección coincide con el hash de la URL, se muestra
            if (`#${seccion.id}` === hash) {
                seccion.style.display = "block";
            } else {
                seccion.style.display = "none";
            }
        });
    };

    // Escuchar cuando el usuario cambia de pestaña (cambia el hash en la URL)
    window.addEventListener("hashchange", enrutador);

    // Ejecutar la función una vez al cargar la página por primera vez
    enrutador();
});