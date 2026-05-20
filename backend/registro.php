<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'conexion.php';

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

        // 2. Campos opcionales de contacto y dirección
        $telefono  = isset($data->telefono)      ? trim($data->telefono)      : null;
        $direccion = isset($data->direccion)     ? trim($data->direccion)     : null;
        $cp        = isset($data->codigo_postal) ? trim($data->codigo_postal) : null;
        $ciudad    = isset($data->ciudad)        ? trim($data->ciudad)        : null;

        // 3. Encriptamos la contraseña (¡NUNCA se guarda en texto plano!)
        $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

        // 4. Guardamos el usuario con todos sus datos
        $insert_stmt = $pdo->prepare("
            INSERT INTO usuarios (nombre, email, password, rol, telefono, direccion, codigo_postal, ciudad)
            VALUES (:nombre, :email, :password, 'usuario', :tel, :dir, :cp, :ciudad)
        ");

        if ($insert_stmt->execute([
            ':nombre'   => $data->nombre,
            ':email'    => $data->email,
            ':password' => $password_hash,
            ':tel'      => $telefono  ?: null,
            ':dir'      => $direccion ?: null,
            ':cp'       => $cp        ?: null,
            ':ciudad'   => $ciudad    ?: null,
        ])) {
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