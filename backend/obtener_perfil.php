<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'conexion.php';

$data = json_decode(file_get_contents("php://input"));

if (empty($data->usuario_id)) {
    http_response_code(400);
    echo json_encode(["error" => "ID de usuario requerido."]);
    exit;
}

try {
    // Traemos todos los datos que necesitamos rellenar en el formulario
    $stmt = $pdo->prepare("SELECT id, nombre, email, telefono, direccion, codigo_postal, ciudad, rol FROM usuarios WHERE id = :id");
    $stmt->execute([':id' => $data->usuario_id]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario) {
        http_response_code(200);
        echo json_encode($usuario);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Usuario no encontrado."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener los datos de la base de datos."]);
}
?>