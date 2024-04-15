FROM     debian:11

RUN     apt update -y

RUN     apt upgrade -y

RUN     apt install nginx -y

RUN     rm -rf /var/www/html/*

COPY    ./nginxConfig/default /etc/nginx/sites-available/

COPY    ./source/*  /var/www/html

CMD     ["nginx","-g", "daemon off;"]