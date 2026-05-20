<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'conexion.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    try {
        // 1. AÑADIDO 'rol' en el SELECT
        $stmt = $pdo->prepare("SELECT id, nombre, password, rol FROM usuarios WHERE email = :email");
        $stmt->execute([':email' => $data->email]);
        
        if ($stmt->rowCount() > 0) {
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Verificamos si la contraseña coincide con el Hash guardado
            if (password_verify($data->password, $usuario['password'])) {
                http_response_code(200);
                
                // 2. AÑADIDO 'rol' en el array de respuesta
                echo json_encode([
                    "mensaje" => "Login exitoso",
                    "usuario" => [
                        "id" => $usuario['id'],
                        "nombre" => $usuario['nombre'],
                        "rol" => $usuario['rol'] 
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(["error" => "Contraseña incorrecta."]);
            }
        } else {
            http_response_code(404);
            echo json_encode(["error" => "No existe ninguna cuenta con este correo."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error de servidor."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Faltan credenciales."]);
}
?>