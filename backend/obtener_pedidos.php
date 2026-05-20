<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'conexion.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->usuario_id)) {
    try {
        // Obtenemos los pedidos del usuario
        $stmt = $pdo->prepare("SELECT * FROM pedidos WHERE usuario_id = :uid ORDER BY fecha_pedido DESC");
        $stmt->execute([':uid' => $data->usuario_id]);
        $pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // A cada pedido le inyectamos sus productos
        foreach ($pedidos as &$pedido) {
            $stmt_det = $pdo->prepare("
                SELECT dp.cantidad, dp.precio_unitario, p.nombre, p.imagen 
                FROM detalles_pedido dp 
                JOIN productos p ON dp.producto_id = p.id 
                WHERE dp.pedido_id = :pid
            ");
            $stmt_det->execute([':pid' => $pedido['id']]);
            $pedido['detalles'] = $stmt_det->fetchAll(PDO::FETCH_ASSOC);
        }

        http_response_code(200);
        echo json_encode($pedidos);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al obtener historial."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "ID de usuario requerido."]);
}
?>