FROM nginx:1.26.0-alpine-slim

RUN apk update && apk add --no-cache nginx openssl vim

WORKDIR /etc/nginx

RUN mkdir ssl && chmod 700 ssl

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/pong.key \
    -out ssl/pong.crt \
    -subj "/C=MO/L=Bengurire/O=1337/OU=Student/CN=ft_trance.1337.fr"

COPY ./config/nginx.conf /etc/nginx/

ARG HOST
ARG PORT

RUN sed -i "s/localhost/${HOST}/g" ./nginx.conf
RUN sed -i "s/port/${PORT}/g" ./nginx.conf

RUN apk cache clean

CMD ["nginx", "-g", "daemon off;"]
