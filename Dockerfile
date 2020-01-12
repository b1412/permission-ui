FROM nginx:1.13.6-alpine
COPY build /usr/share/nginx/html
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
