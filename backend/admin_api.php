<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'conexion.php';

$data = json_decode(file_get_contents("php://input"));

// 1. Verificamos que nos envían un ID de usuario para validar
if (!empty($data->admin_id)) {
    try {
        // 2. Seguridad: Comprobamos en la BD que este usuario es realmente un admin
        $stmt_check = $pdo->prepare("SELECT rol FROM usuarios WHERE id = :id");
        $stmt_check->execute([':id' => $data->admin_id]);
        $user = $stmt_check->fetch(PDO::FETCH_ASSOC);

        if ($user && $user['rol'] === 'admin') {
            // 3. Obtenemos TODOS los pedidos cruzando (JOIN) con la tabla usuarios
            $stmt = $pdo->prepare("
                SELECT p.id, p.fecha_pedido, p.total, p.estado, u.nombre, u.email 
                FROM pedidos p
                LEFT JOIN usuarios u ON p.usuario_id = u.id
                ORDER BY p.fecha_pedido DESC
            ");
            $stmt->execute();
            $pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // 4. Inyectamos los detalles a cada pedido (para saber qué compraron)
            foreach ($pedidos as &$pedido) {
                $stmt_det = $pdo->prepare("
                    SELECT dp.cantidad, dp.precio_unitario, prod.nombre 
                    FROM detalles_pedido dp 
                    JOIN productos prod ON dp.producto_id = prod.id 
                    WHERE dp.pedido_id = :pid
                ");
                $stmt_det->execute([':pid' => $pedido['id']]);
                $pedido['detalles'] = $stmt_det->fetchAll(PDO::FETCH_ASSOC);
            }

            http_response_code(200);
            echo json_encode($pedidos);
        } else {
            // Si el rol no es admin, denegamos el acceso
            http_response_code(403);
            echo json_encode(["error" => "Acceso denegado. Permisos insuficientes."]);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al obtener la lista de pedidos."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Falta la identificación del administrador."]);
}
?>