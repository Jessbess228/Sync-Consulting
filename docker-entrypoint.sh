#!/bin/sh
set -eu

PORT="${PORT:-8080}"
export PORT
export LAYOUT_PATH="${LAYOUT_PATH:-/var/cms-layout/layout.json}"

# Second arg is which env vars to expand (not the template). stdin is the nginx template.
# Whitelist avoids expanding nginx $uri, $host, etc.
envsubst '${PORT} ${LAYOUT_PATH}' < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

node /app/cms/server.js &

exec nginx -g 'daemon off;'
