<?php
require_once 'config.php';

$data   = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? '';

if ($action === 'signup') {
    $name     = trim($data['name'] ?? '');
    $email    = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $role     = $data['role'] ?? 'student';
    $grade    = $data['grade'] ?? 'SSC';

    if (!$name || !$email || !$password) {
        echo json_encode(['success' => false, 'message' => 'সব তথ্য দিন।']);
        exit;
    }

    $db   = getDB();
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $db->prepare("INSERT INTO users (name, email, password, role, grade) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param('sssss', $name, $email, $hash, $role, $grade);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'user_id' => $db->insert_id,
            'message' => 'অ্যাকাউন্ট তৈরি হয়েছে!'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'ইমেইল আগে থেকে আছে।']);
    }
    $db->close();

} elseif ($action === 'signin') {
    $email    = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if (!$email || !$password) {
        echo json_encode(['success' => false, 'message' => 'ইমেইল ও পাসওয়ার্ড দিন।']);
        exit;
    }

    $db   = getDB();
    $stmt = $db->prepare("SELECT id, name, password, role, grade FROM users WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user   = $result->fetch_assoc();

    if ($user && password_verify($password, $user['password'])) {
        echo json_encode([
            'success'      => true,
            'access_token' => base64_encode($user['id'] . ':' . time()),
            'user_id'      => (string)$user['id'],
            'user_name'    => $user['name'],
            'role'         => $user['role'],
            'grade'        => $user['grade'],
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'ইমেইল বা পাসওয়ার্ড ভুল।']);
    }
    $db->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>
