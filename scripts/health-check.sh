#!/bin/bash

URL="http://localhost"
TIMEOUT=5

response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$URL")

if [ "$response" = "200" ]; then
    echo "✅ 服务正常 (HTTP $response)"
    exit 0
else
    echo "❌ 服务异常 (HTTP $response)"
    exit 1
fi
