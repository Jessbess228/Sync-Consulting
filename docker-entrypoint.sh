#!/bin/sh
set -eu

PORT="${PORT:-8080}"
export PORT

LAYOUT_PATH="${LAYOUT_PATH:-/var/cms-layout/layout.json}"
BAKED_LAYOUT="/usr/share/nginx/html/website-builder/layout.json"
if [ ! -f "$LAYOUT_PATH" ] && [ -f "$BAKED_LAYOUT" ]; then
  LAYOUT_PATH="$BAKED_LAYOUT"
fi
export LAYOUT_PATH

# Second arg is which env vars to expand (not the template). stdin is the nginx template.
# Whitelist avoids expanding nginx $uri, $host, etc.
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

export LAYOUT_PATH
node /app/cms/server.js &

exec nginx -g 'daemon off;'
