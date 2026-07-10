#!/bin/zsh
set -e

PROJECT_DIR="/Users/pengmengyu/Documents/网站创作"
ADMIN_URL="http://localhost:5173/admin/"
LOG_FILE="/tmp/fy-digital-life-dev.log"

cd "$PROJECT_DIR"

if ! curl -fsS "http://localhost:5173/" >/dev/null 2>&1; then
  echo "正在启动 FY Digital Life 本地预览..."
  nohup npm run dev >"$LOG_FILE" 2>&1 &

  for _ in {1..30}; do
    if curl -fsS "http://localhost:5173/" >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done
fi

open "$ADMIN_URL"
echo "后台已打开：$ADMIN_URL"
sleep 2
