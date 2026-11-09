#!/bin/sh
set -eu

PORT="${PORT:-8080}"
export PORT
export LAYOUT_PATH="${LAYOUT_PATH:-/usr/share/nginx/html/website-builder/layout.json}"

envsubst '${PORT}' < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

node /app/cms/server.js &

exec nginx -g 'daemon off;'
