# Builds a Docker to deliver dist/
# Alternatively, use nginx:alpine for a smaller image
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
COPY config/default.conf /etc/nginx/conf.d/default.conf
