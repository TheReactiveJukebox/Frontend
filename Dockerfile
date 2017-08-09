# Builds a Docker to deliver dist/
# https://hub.docker.com/_/nginx/
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
COPY config/default.conf /etc/nginx/conf.d/default.conf
