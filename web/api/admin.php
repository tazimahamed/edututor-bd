<?php
require_once 'config.php';

$action = $_GET['action'] ?? 'dashboard';

if ($action === 'dashboard') {
    $db = getDB();

    // মোট student
    $result         = $db->query("SELECT COUNT(*) as total FROM users WHERE role = 'student'");
    $total_students = $result->fetch_assoc()['total'];

    // মোট session
    $result         = $db->query("SELECT COUNT(*) as total FROM sessions");
    $total_sessions = $result->fetch_assoc()['total'];

    // Overall average
    $result      = $db->query("SELECT AVG(percentage) as avg FROM sessions");
    $overall_avg = round($result->fetch_assoc()['avg'] ?? 0);

    // প্রতিটি student এর details
    $result   = $db->query("
        SELECT 
            u.id, u.name, u.email, u.grade,
            COUNT(s.id) as total_sessions,
            ROUND(AVG(s.percentage)) as avg_score,
            ROUND(AVG(CASE WHEN s.subject = 'physics'   THEN s.percentage END)) as physics_avg,
            ROUND(AVG(CASE WHEN s.subject = 'chemistry' THEN s.percentage END)) as chemistry_avg,
            ROUND(AVG(CASE WHEN s.subject = 'math'      THEN s.percentage END)) as math_avg
        FROM users u
        LEFT JOIN sessions s ON u.id = s.user_id
        WHERE u.role = 'student'
        GROUP BY u.id
        ORDER BY avg_score DESC
    ");
    $students = $result->fetch_all(MYSQLI_ASSOC);
    $db->close();

    echo json_encode([
        'success'         => true,
        'total_students'  => $total_students,
        'total_sessions'  => $total_sessions,
        'overall_avg'     => $overall_avg,
        'students'        => $students
    ]);
}
?>
