#!/bin/sh

set -e

cd /application/galette;

chmod -R 777 data;
chmod 777 config;

composer install --no-interaction

exec "$@"