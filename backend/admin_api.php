<?php
header("Content-Type: application/json");
require_once 'conexion.php';

$data = json_decode(file_get_contents("php://input"));
$action = $data->action ?? '';

// Verificación de seguridad básica (idealmente validar token de sesión)
// Por ahora, verificamos si el usuario es admin
$stmt = $pdo->prepare("SELECT rol FROM usuarios WHERE id = ?");
$stmt->execute([$data->usuario_id]);
$user = $stmt->fetch();

if (!$user || $user['rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["error" => "No tienes permisos de administrador"]);
    exit;
}

try {
    switch ($action) {
        case 'guardar_producto':
            // Lógica para INSERT o UPDATE
            break;
        case 'eliminar_producto':
            $stmt = $pdo->prepare("DELETE FROM productos WHERE id = ?");
            $stmt->execute([$data->producto_id]);
            echo json_encode(["mensaje" => "Producto eliminado"]);
            break;
        case 'actualizar_pedido':
            $stmt = $pdo->prepare("UPDATE pedidos SET estado = ? WHERE id = ?");
            $stmt->execute([$data->nuevo_estado, $data->pedido_id]);
            echo json_encode(["mensaje" => "Estado actualizado"]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>