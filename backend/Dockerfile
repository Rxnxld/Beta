FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    libpng-dev \
    libcurl4-openssl-dev \
    unzip \
    curl \
    && docker-php-ext-install pdo_mysql mbstring zip xml bcmath gd fileinfo \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN mkdir -p storage/framework/views storage/framework/cache storage/framework/sessions bootstrap/cache

RUN cp .env.example .env 2>/dev/null || true && php artisan key:generate --force 2>/dev/null || true

RUN composer install --optimize-autoloader 2>&1

RUN chmod -R 777 storage bootstrap/cache

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=$PORT
