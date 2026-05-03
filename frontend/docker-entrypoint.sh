#!/bin/sh
set -e
API_URI="${API_URI:-https://events-api.cevi.tools}"
envsubst '${API_URI}' < /etc/nginx/config.json.template \
  > /usr/share/nginx/html/de-CH/assets/config.json
cp /usr/share/nginx/html/de-CH/assets/config.json \
   /usr/share/nginx/html/fr-CH/assets/config.json
exec nginx -g 'daemon off;'
