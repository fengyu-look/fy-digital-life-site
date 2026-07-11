#!/bin/zsh
set -e

PROJECT_DIR="/Users/pengmengyu/Documents/网站创作"
SITE_URL="http://localhost:5173/"
LOG_FILE="/tmp/fy-digital-life-dev.log"

cd "$PROJECT_DIR"

if ! curl -fsS "$SITE_URL" >/dev/null 2>&1; then
  echo "正在启动 FY Digital Life 本地预览..."
  nohup npm run dev >"$LOG_FILE" 2>&1 &

  for _ in {1..30}; do
    if curl -fsS "$SITE_URL" >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done
fi

open "$SITE_URL"
echo "前台已打开：$SITE_URL"
sleep 2
