<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'conexion.php'; // Incluimos tu conexión

try {
    // Agrupamos y calculamos la media y el total de reseñas por producto
    $stmt = $pdo->prepare("
        SELECT p.*, 
               COALESCE(AVG(r.puntuacion), 0) AS valoracion_media,
               COUNT(r.id) AS total_resenas
        FROM productos p
        LEFT JOIN resenas r ON p.id = r.producto_id
        GROUP BY p.id
    ");
    $stmt->execute();
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convertimos los tipos de datos para que el JS los entienda correctamente
    $productos = array_map(function($p) {
        $p['id'] = (int)$p['id'];
        $p['precio'] = (float)$p['precio'];
        $p['precioOriginal'] = $p['precio_original'] ? (float)$p['precio_original'] : null;
        
        // Formateamos las nuevas variables de la valoración
        $p['valoracion_media'] = (float)$p['valoracion_media'];
        $p['total_resenas'] = (int)$p['total_resenas'];
        
        unset($p['precio_original']); 
        return $p;
    }, $productos);

    echo json_encode($productos, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>