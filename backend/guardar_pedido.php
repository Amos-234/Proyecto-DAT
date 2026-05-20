<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'conexion.php';

$data = json_decode(file_get_contents("php://input"));

// Solo procesamos si nos llega el ID del usuario, el total y el carrito
if (!empty($data->usuario_id) && !empty($data->total) && !empty($data->carrito)) {
    try {
        $pdo->beginTransaction();

        // 1. Creamos el registro principal del pedido
        $stmt_pedido = $pdo->prepare("INSERT INTO pedidos (usuario_id, total, estado) VALUES (:uid, :total, 'Procesando')");
        $stmt_pedido->execute([':uid' => $data->usuario_id, ':total' => $data->total]);
        
        $pedido_id = $pdo->lastInsertId();

        // 2. Guardamos producto por producto en la tabla de detalles
        $stmt_detalle = $pdo->prepare("INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES (:pid, :prod_id, :cant, :precio)");
        
        // 3. Restar el stock
        $stmt_stock = $pdo->prepare("UPDATE productos SET stock = stock - :cantidad WHERE id = :producto_id AND stock >= :cantidad");
        $stmt_stock->execute([
            ':cantidad' => $item->cantidad,
            ':producto_id' => $item->id
        ]);

        foreach ($data->carrito as $item) {
            $stmt_detalle->execute([
                ':pid' => $pedido_id,
                ':prod_id' => $item->id,
                ':cant' => $item->cantidad,
                ':precio' => $item->precio
            ]);
        }

        $pdo->commit();

        http_response_code(201);
        echo json_encode(["mensaje" => "Pedido guardado con éxito.", "pedido_id" => $pedido_id]);

    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["error" => "Error al guardar el pedido: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Datos de pedido incompletos."]);
}
?>