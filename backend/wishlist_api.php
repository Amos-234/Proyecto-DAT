<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'conexion.php';

$data = json_decode(file_get_contents("php://input"));

if (empty($data->usuario_id) || empty($data->accion)) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan parámetros."]);
    exit;
}

try {
    // ACCIÓN: OBTENER TODOS LOS IDs DE FAVORITOS DE UN USUARIO
    if ($data->accion === 'get') {
        $stmt = $pdo->prepare("SELECT producto_id FROM lista_deseos WHERE usuario_id = :uid");
        $stmt->execute([':uid' => $data->usuario_id]);
        $ids = $stmt->fetchAll(PDO::FETCH_COLUMN); // Devuelve [1, 5, 8...]
        echo json_encode($ids);
    } 
    // ACCIÓN: AÑADIR O QUITAR (TOGGLE)
    elseif ($data->accion === 'toggle' && !empty($data->producto_id)) {
        $stmt_check = $pdo->prepare("SELECT 1 FROM lista_deseos WHERE usuario_id = :uid AND producto_id = :pid");
        $stmt_check->execute([':uid' => $data->usuario_id, ':pid' => $data->producto_id]);
        
        if ($stmt_check->fetch()) {
            $stmt_del = $pdo->prepare("DELETE FROM lista_deseos WHERE usuario_id = :uid AND producto_id = :pid");
            $stmt_del->execute([':uid' => $data->usuario_id, ':pid' => $data->producto_id]);
            echo json_encode(["estado" => "eliminado"]);
        } else {
            $stmt_add = $pdo->prepare("INSERT INTO lista_deseos (usuario_id, producto_id) VALUES (:uid, :pid)");
            $stmt_add->execute([':uid' => $data->usuario_id, ':pid' => $data->producto_id]);
            echo json_encode(["estado" => "añadido"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Acción no válida."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error de base de datos."]);
}
?>