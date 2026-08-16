FROM node:24-alpine AS builder

WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=builder /app/dist/eventoverview/browser /usr/share/nginx/html
COPY root-index.html /usr/share/nginx/html/index.html
COPY lang-redirect.js /usr/share/nginx/html/lang-redirect.js
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY config.json.template /etc/nginx/config.json.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
# nginx runs as the unprivileged "nginx" user, so it listens on 8080 instead of 80 and needs write
# access to the paths the entrypoint renders into plus nginx's own runtime directories
RUN chmod +x /docker-entrypoint.sh \
    && rm -f /etc/nginx/conf.d/default.conf \
    && touch /var/run/nginx.pid \
    && chown -R nginx:nginx /usr/share/nginx/html /etc/nginx/conf.d /var/cache/nginx \
       /var/log/nginx /var/run/nginx.pid
USER nginx
EXPOSE 8080
ENTRYPOINT ["/docker-entrypoint.sh"]
