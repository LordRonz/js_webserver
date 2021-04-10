FROM nginx:1.18.0-alpine

COPY ./nginx-conf/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./ssl/. /sslskey

RUN addgroup -S yourmom && adduser -S yourmom -G yourmom
USER yourmom