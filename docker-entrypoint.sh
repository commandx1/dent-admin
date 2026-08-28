#!/bin/sh
set -eu

js_escape() {
  # trim leading/trailing whitespace then escape for JS string literals
  printf '%s' "${1:-}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' \
    -e 's/\\/\\\\/g' \
    -e 's/"/\\"/g' \
    -e 's/'"'"'/\\'"'"'/g' \
    -e 's/\r/\\r/g' \
    -e 's/\n/\\n/g' \
    -e 's/\t/\\t/g'
}

ENV_JS="/usr/share/nginx/html/env.js"

cat > "$ENV_JS" <<EOF
window.__ENV__ = {
  "VITE_API_URL": "$(js_escape "${VITE_API_URL:-}")",
  "VITE_PUBLIC_GOOGLE_MAPS_API_KEY": "$(js_escape "${VITE_PUBLIC_GOOGLE_MAPS_API_KEY:-}")",
  "VITE_TECHNICIAN_USER_ACCESS_TOKEN": "$(js_escape "${VITE_TECHNICIAN_USER_ACCESS_TOKEN:-}")",
  "VITE_TECHNICIAN_USER_REFRESH_TOKEN": "$(js_escape "${VITE_TECHNICIAN_USER_REFRESH_TOKEN:-}")",
  "VITE_INVOICE_ACCESS_TOKEN": "$(js_escape "${VITE_INVOICE_ACCESS_TOKEN:-}")",
  "VITE_B2B_URL": "$(js_escape "${VITE_B2B_URL:-}")",
  "VITE_ECOMMERCE_API_URL": "$(js_escape "${VITE_ECOMMERCE_API_URL:-}")"
};
EOF

exec nginx -g "daemon off;"
