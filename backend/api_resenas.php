<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");

require_once 'conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

// --- OBTENER RESEÑAS DE UN PRODUCTO ---
if ($method === 'GET') {
    $producto_id = isset($_GET['producto_id']) ? intval($_GET['producto_id']) : 0;
    if ($producto_id > 0) {
        // Hacemos JOIN con usuarios para sacar el nombre del cliente
        $stmt = $pdo->prepare("
            SELECT r.*, u.nombre 
            FROM resenas r 
            JOIN usuarios u ON r.usuario_id = u.id 
            WHERE r.producto_id = :pid 
            ORDER BY r.fecha_resena DESC
        ");
        $stmt->execute([':pid' => $producto_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } else {
        echo json_encode([]);
    }
} 
// --- GUARDAR UNA NUEVA RESEÑA ---
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    // Verificamos que la puntuación exista y sea válida (1-5)
    if (!empty($data->usuario_id) && !empty($data->producto_id) && !empty($data->puntuacion)) {
        try {
            // ON DUPLICATE KEY UPDATE permite que si el usuario ya reseñó, simplemente edite su reseña
            $stmt = $pdo->prepare("
                INSERT INTO resenas (usuario_id, producto_id, puntuacion, comentario) 
                VALUES (:uid, :pid, :punt, :com)
                ON DUPLICATE KEY UPDATE 
                puntuacion = :punt, comentario = :com, fecha_resena = CURRENT_TIMESTAMP
            ");
            $stmt->execute([
                ':uid' => $data->usuario_id,
                ':pid' => $data->producto_id,
                ':punt' => $data->puntuacion,
                ':com' => empty($data->comentario) ? null : trim($data->comentario)
            ]);
            echo json_encode(["mensaje" => "Tu reseña se ha guardado correctamente. ¡Gracias por tu opinión!"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al guardar la reseña."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "La puntuación de estrellas es obligatoria."]);
    }
}
?>