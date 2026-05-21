<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"), true);
$usuario_id = isset($data['usuario_id']) ? intval($data['usuario_id']) : 0;

if ($usuario_id <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Identificador de usuario no válido."]);
    exit;
}

try {
    // Conexión a tu base de datos real
    $pdo = new PDO("mysql:host=localhost;dbname=telecom_db;charset=utf8", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Borramos únicamente al usuario. 
    // Gracias a la nueva regla ON DELETE SET NULL, la base de datos conservará sus pedidos 
    // pero los desvinculará de su cuenta (el usuario_id pasará a valer NULL).
    $stmt = $pdo->prepare("DELETE FROM usuarios WHERE id = :id");
    $stmt->execute(['id' => $usuario_id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["mensaje" => "Tu cuenta ha sido eliminada correctamente. Tus pedidos previos se conservan de forma anónima por obligaciones legales y de contabilidad."]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "El usuario especificado no existe en el sistema."]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Fallo en la base de datos: " . $e->getMessage()]);
}
?>