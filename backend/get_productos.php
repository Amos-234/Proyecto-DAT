<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'conexion.php'; // Incluimos tu conexión

try {
    $stmt = $pdo->prepare("SELECT * FROM productos");
    $stmt->execute();
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convertimos los tipos de datos para que el JS los entienda correctamente
    $productos = array_map(function($p) {
        $p['id'] = (int)$p['id'];
        $p['precio'] = (float)$p['precio'];
        $p['precioOriginal'] = $p['precio_original'] ? (float)$p['precio_original'] : null;
        unset($p['precio_original']); // Limpiamos para que coincida con el nombre que espera tu app.js
        return $p;
    }, $productos);

    echo json_encode($productos, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>