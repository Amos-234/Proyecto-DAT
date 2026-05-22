<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'conexion.php';

$data = json_decode(file_get_contents("php://input"));

// Validación de seguridad básica
if (empty($data->admin_id) || empty($data->accion)) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan parámetros"]);
    exit;
}

try {
    // Comprobar que es admin
    $stmt_check = $pdo->prepare("SELECT rol FROM usuarios WHERE id = :id");
    $stmt_check->execute([':id' => $data->admin_id]);
    $user = $stmt_check->fetch(PDO::FETCH_ASSOC);

    if (!$user || $user['rol'] !== 'admin') {
        http_response_code(403);
        echo json_encode(["error" => "No tienes permisos de administrador."]);
        exit;
    }

    // ACCIÓN: ACTUALIZAR STOCK
    if ($data->accion === 'actualizar_stock') {
        $stmt = $pdo->prepare("UPDATE productos SET stock = :stock WHERE id = :id");
        $stmt->execute([':stock' => $data->stock, ':id' => $data->producto_id]);
        echo json_encode(["mensaje" => "Stock actualizado correctamente"]);
    }
    
    // ACCIÓN: ELIMINAR PRODUCTO
    elseif ($data->accion === 'eliminar') {
        $stmt = $pdo->prepare("DELETE FROM productos WHERE id = :id");
        $stmt->execute([':id' => $data->producto_id]);
        echo json_encode(["mensaje" => "Producto eliminado"]);
    }
    
    // ACCIÓN: AÑADIR PRODUCTO
    elseif ($data->accion === 'añadir') {
        $stmt = $pdo->prepare("INSERT INTO productos (nombre, marca, categoria, precio, imagen, descripcion, descripcion_detallada, stock) VALUES (:nom, :mar, :cat, :pre, :img, :desc, :desc_det, :stock)");
        $stmt->execute([
            ':nom' => $data->nombre,
            ':mar' => $data->marca,
            ':cat' => $data->categoria,
            ':pre' => $data->precio,
            ':img' => $data->imagen,
            ':desc' => $data->descripcion,
            ':desc_det' => $data->descripcion_detallada, // Añadido aquí
            ':stock' => $data->stock
        ]);
        echo json_encode(["mensaje" => "Producto añadido con éxito"]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error en la base de datos: " . $e->getMessage()]);
}
?>