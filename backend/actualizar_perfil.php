<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'conexion.php';

$data = json_decode(file_get_contents("php://input"));

if (empty($data->usuario_id) || empty($data->accion)) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan parámetros obligatorios."]);
    exit;
}

try {
    $stmt_check = $pdo->prepare("SELECT id, password FROM usuarios WHERE id = :id");
    $stmt_check->execute([':id' => $data->usuario_id]);
    $usuario = $stmt_check->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        http_response_code(404);
        echo json_encode(["error" => "Usuario no encontrado."]);
        exit;
    }

    // --- ACCIÓN: DATOS PERSONALES (nombre + email) ---
    if ($data->accion === 'datos_personales') {

        if (empty($data->nombre) || empty($data->email)) {
            http_response_code(400);
            echo json_encode(["error" => "Nombre y email son obligatorios."]);
            exit;
        }

        $nombre = trim($data->nombre);
        $email  = trim($data->email);

        if (strlen($nombre) < 3) {
            http_response_code(400);
            echo json_encode(["error" => "El nombre debe tener al menos 3 caracteres."]);
            exit;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(["error" => "El formato del email no es válido."]);
            exit;
        }

        $stmt_email = $pdo->prepare("SELECT id FROM usuarios WHERE email = :email AND id != :id");
        $stmt_email->execute([':email' => $email, ':id' => $data->usuario_id]);
        if ($stmt_email->fetch()) {
            http_response_code(409);
            echo json_encode(["error" => "Este email ya está registrado por otro usuario."]);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE usuarios SET nombre = :nombre, email = :email WHERE id = :id");
        $stmt->execute([':nombre' => $nombre, ':email' => $email, ':id' => $data->usuario_id]);

        http_response_code(200);
        echo json_encode(["mensaje" => "Datos personales actualizados correctamente."]);
    }

    // --- ACCIÓN: CONTACTO Y DIRECCIÓN (teléfono + dirección + CP + ciudad) ---
    elseif ($data->accion === 'direccion') {

        $telefono  = isset($data->telefono)      ? trim($data->telefono)      : '';
        $direccion = isset($data->direccion)     ? trim($data->direccion)     : '';
        $cp        = isset($data->codigo_postal) ? trim($data->codigo_postal) : '';
        $ciudad    = isset($data->ciudad)        ? trim($data->ciudad)        : '';

        // Validar teléfono: solo dígitos, espacios y + opcional al inicio
        if ($telefono !== '' && !preg_match('/^\+?[\d\s\-]{7,15}$/', $telefono)) {
            http_response_code(400);
            echo json_encode(["error" => "El formato del teléfono no es válido."]);
            exit;
        }
        if ($cp !== '' && !preg_match('/^\d{4,5}$/', $cp)) {
            http_response_code(400);
            echo json_encode(["error" => "El código postal debe tener 4 o 5 dígitos."]);
            exit;
        }

        $stmt = $pdo->prepare("
            UPDATE usuarios
            SET telefono = :tel, direccion = :dir, codigo_postal = :cp, ciudad = :ciudad
            WHERE id = :id
        ");
        $stmt->execute([
            ':tel'    => $telefono  ?: null,
            ':dir'    => $direccion ?: null,
            ':cp'     => $cp        ?: null,
            ':ciudad' => $ciudad    ?: null,
            ':id'     => $data->usuario_id
        ]);

        http_response_code(200);
        echo json_encode(["mensaje" => "Dirección y teléfono actualizados correctamente."]);
    }

    // --- ACCIÓN: CAMBIAR CONTRASEÑA ---
    elseif ($data->accion === 'password') {

        if (empty($data->password_actual) || empty($data->password_nueva)) {
            http_response_code(400);
            echo json_encode(["error" => "Debes proporcionar la contraseña actual y la nueva."]);
            exit;
        }
        if (!password_verify($data->password_actual, $usuario['password'])) {
            http_response_code(401);
            echo json_encode(["error" => "La contraseña actual no es correcta."]);
            exit;
        }

        $patron = '/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/';
        if (!preg_match($patron, $data->password_nueva)) {
            http_response_code(400);
            echo json_encode(["error" => "La nueva contraseña no cumple los requisitos de seguridad."]);
            exit;
        }

        $hash = password_hash($data->password_nueva, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE usuarios SET password = :pass WHERE id = :id");
        $stmt->execute([':pass' => $hash, ':id' => $data->usuario_id]);

        http_response_code(200);
        echo json_encode(["mensaje" => "Contraseña actualizada correctamente."]);
    }

    else {
        http_response_code(400);
        echo json_encode(["error" => "Acción no reconocida."]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error en la base de datos."]);
}
?>