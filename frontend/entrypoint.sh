#!/bin/sh
# Replace environment variables in nginx.conf.template and output to nginx.conf
envsubst '$$DOMAIN_NAME $$SSL_CERT_PATH $$SSL_CERT_KEY_PATH' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Continue to the main command
exec "$@"
