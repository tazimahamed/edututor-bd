<?php
require_once 'config.php';

$data      = json_decode(file_get_contents('php://input'), true);
$action    = $_GET['action'] ?? 'get';
$student_id = $_GET['student_id'] ?? ($data['student_id'] ?? '');

if ($action === 'save') {
    $db   = getDB();
    $stmt = $db->prepare("INSERT INTO sessions (user_id, subject, chapter_id, question, student_answer, score, max_score, percentage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        'isssssii',
        $student_id,
        $data['subject'],
        $data['chapter_id'],
        $data['question'],
        $data['student_answer'],
        $data['score'],
        $data['max_score'],
        $data['percentage']
    );
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => $db->error]);
    }
    $db->close();

} elseif ($action === 'get') {
    $db     = getDB();
    $stmt   = $db->prepare("SELECT subject, score, max_score, percentage FROM sessions WHERE user_id = ?");
    $stmt->bind_param('i', $student_id);
    $stmt->execute();
    $result   = $stmt->get_result();
    $sessions = $result->fetch_all(MYSQLI_ASSOC);
    $db->close();

    $total    = count($sessions);
    $avgScore = $total > 0 ? round(array_sum(array_column($sessions, 'percentage')) / $total) : 0;

    $subjects = ['physics' => [], 'chemistry' => [], 'math' => []];
    foreach ($sessions as $s) {
        if (isset($subjects[$s['subject']])) {
            $subjects[$s['subject']][] = $s['percentage'];
        }
    }

    $subjectData = [];
    foreach ($subjects as $key => $scores) {
        $count = count($scores);
        $subjectData[$key] = [
            'score'    => $count > 0 ? round(array_sum($scores) / $count) : 0,
            'sessions' => $count
        ];
    }

    echo json_encode([
        'success'        => true,
        'report' => [
            'total_sessions' => $total,
            'average_score'  => $avgScore,
            'subjects'       => $subjectData,
            'weak_areas'     => []
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>
