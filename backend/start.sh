#!/bin/bash
# Generar .env desde variables de entorno
cat > .env << EOF
APP_ENV=${APP_ENV:-production}
APP_DEBUG=${APP_DEBUG:-false}
APP_KEY=${APP_KEY:-}
DB_CONNECTION=${DB_CONNECTION:-mysql}
DB_HOST=${DB_HOST:-127.0.0.1}
DB_PORT=${DB_PORT:-3306}
DB_DATABASE=${DB_DATABASE:-sistema_gestion}
DB_USERNAME=${DB_USERNAME:-root}
DB_PASSWORD=${DB_PASSWORD:-}
MYSQL_ATTR_SSL_CA=${MYSQL_ATTR_SSL_CA:-}
MYSQL_ATTR_SSL_VERIFY_SERVER_CERT=${MYSQL_ATTR_SSL_VERIFY_SERVER_CERT:-false}
SANCTUM_STATEFUL_DOMAINS=${SANCTUM_STATEFUL_DOMAINS:-}
EOF

# Generar APP_KEY si no existe
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Ejecutar migraciones si RUN_MIGRATE_ON_BOOT=true
if [ "$RUN_MIGRATE_ON_BOOT" = "true" ]; then
    php artisan migrate --force
    php artisan db:seed --force
fi

# Iniciar servidor
php artisan serve --host=0.0.0.0 --port=$PORT
