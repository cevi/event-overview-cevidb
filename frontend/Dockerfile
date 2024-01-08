FROM node:18-alpine as builder

ARG build_configuration
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build:$build_configuration

FROM nginx:alpine
COPY --from=builder /app/dist/eventoverview/browser /usr/share/nginx/html
EXPOSE 80
