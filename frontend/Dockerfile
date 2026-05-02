FROM node:24-alpine AS builder

ARG build_configuration
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build:$build_configuration

FROM nginx:alpine
COPY --from=builder /app/dist/eventoverview/browser /usr/share/nginx/html
COPY root-index.html /usr/share/nginx/html/index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
