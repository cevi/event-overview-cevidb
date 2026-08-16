#!/bin/sh
set -e
# export, otherwise envsubst does not see it and the default below never applies
export API_URI="${API_URI:-https://events-api.cevi.tools}"
envsubst '${API_URI}' < /etc/nginx/config.json.template \
  > /usr/share/nginx/html/de-CH/assets/config.json
cp /usr/share/nginx/html/de-CH/assets/config.json \
   /usr/share/nginx/html/fr-CH/assets/config.json
# the same backend address has to appear in the CSP connect-src
envsubst '${API_URI}' < /etc/nginx/nginx.conf.template \
  > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
