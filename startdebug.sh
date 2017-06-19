#!/bin/sh

# Startup script for Docker container in dev environment.

echo "
Executing the following command in ${APP_ROOT}:

exec node ${APP_ROOT}/node_modules/webpack-dev-server/bin/webpack-dev-server.js \

     --config ${APP_ROOT}/config/webpack.dev.js \

     --content-base ${APP_ROOT}/src/ \

     --host 0.0.0.0 --port 80 \

     --progress --profile --watch
"

cd ${APP_ROOT}
exec node ${APP_ROOT}/node_modules/webpack-dev-server/bin/webpack-dev-server.js \
     --config ${APP_ROOT}/config/webpack.dev.js \
     --content-base ${APP_ROOT}/src/ \
     --host 0.0.0.0 --port 80 \
     --progress --profile --watch
