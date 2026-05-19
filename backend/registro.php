<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'conexion.php';

// Recogemos el JSON que nos envía el Frontend
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->nombre) && !empty($data->email) && !empty($data->password)) {
    try {
        // 1. Comprobamos si el email ya existe
        $check_stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = :email");
        $check_stmt->execute([':email' => $data->email]);
        
        if ($check_stmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(["error" => "Este correo electrónico ya está registrado."]);
            exit;
        }

        // 2. Encriptamos la contraseña (¡NUNCA se guarda en texto plano!)
        $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

        // 3. Guardamos el usuario
        $insert_stmt = $pdo->prepare("INSERT INTO usuarios (nombre, email, password) VALUES (:nombre, :email, :password)");
        
        if ($insert_stmt->execute([':nombre' => $data->nombre, ':email' => $data->email, ':password' => $password_hash])) {
            http_response_code(201);
            echo json_encode(["mensaje" => "Usuario registrado correctamente."]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "No se pudo registrar el usuario."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error de base de datos: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos en el formulario."]);
}
?>