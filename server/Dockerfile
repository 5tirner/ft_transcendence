FROM nginx:1.26.0-alpine-slim

RUN mkdir -p /var/www/transcendence

COPY conf/nginx.conf /etc/nginx/

ENTRYPOINT ["nginx", "-g", "daemon off;"]