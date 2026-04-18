<?php
// CORS Proxy for AI Tools
// 用法: proxy.php?url=API_URL
// 放在和 tools.html 同目录下

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$target = $_GET['url'] ?? '';
if (!$target) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing url parameter']);
    exit;
}

$ch = curl_init($target);
$headers = [];
foreach ($_SERVER as $key => $val) {
    if (stripos($key, 'HTTP_') === 0) {
        $header = str_replace('_', '-', substr($key, 5)) . ': ' . $val;
        if (stripos($header, 'authorization') !== false) {
            $headers[] = $header;
        }
    }
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($httpCode);
header('Content-Type: application/json');
echo $response;
