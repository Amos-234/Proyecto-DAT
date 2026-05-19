<?php
// Configuración de la base de datos local (XAMPP por defecto)
$host = "127.0.0.1"; // Es lo mismo que localhost
$usuario = "root";   // XAMPP usa "root" por defecto
$password = "";      // XAMPP no tiene contraseña por defecto
$base_datos = "telecom_db"; // El nombre de la BD que acabas de crear

// Intentamos establecer la conexión
try {
    // Configuramos el DSN (Data Source Name)
    $dsn = "mysql:host=$host;dbname=$base_datos;charset=utf8mb4";
    
    // Creamos la instancia PDO (PHP Data Objects)
    // Usamos PDO porque es el estándar más seguro y profesional hoy en día
    $pdo = new PDO($dsn, $usuario, $password);
    
    // Configuramos PDO para que lance excepciones (errores claros) si algo falla
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Si quieres probar si funciona, puedes descomentar la siguiente línea:
    // echo "¡Conexión a la base de datos establecida con éxito!";

} catch (PDOException $e) {
    // Si hay un error, matamos el proceso y mostramos el problema
    die("Error de conexión a la base de datos: " . $e->getMessage());
}
?>