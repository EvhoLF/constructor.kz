# -------- ОСНОВНОЙ БАЗОВЫЙ СЛОЙ --------
FROM node:20-alpine AS base

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем зависимости системы (если потребуется OpenSSL)
RUN apk add --no-cache openssl

# Копируем package-файлы
COPY package*.json ./

# -------- СБОРКА КОДА --------
FROM base AS build

# Устанавливаем все зависимости (включая dev)
RUN npm install

# Копируем исходный код
COPY . .

# Генерация Prisma Client (путь: ../app/generated/prisma)
RUN npx prisma generate --schema=./schema.prisma

# Сборка проекта Next.js
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

# -------- ПРОДАКШЕН УСТАНОВКА DEP'ОВ --------
FROM base AS prod-deps

# Устанавливаем только продакшн-зависимости
RUN npm install --omit=dev

# Копируем Prisma схему, чтобы сгенерировать клиент
COPY prisma ./prisma
RUN npx prisma generate

# Сохраняем папку с node_modules
RUN cp -R node_modules prod_node_modules

# -------- ФИНАЛЬНЫЙ ПРОД-КОНТЕЙНЕР --------
FROM node:20-alpine AS runner

WORKDIR /app

# Копируем собранные артефакты и зависимости
COPY --from=prod-deps /app/prod_node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/next.config.ts ./
COPY --from=build /app/prisma ./prisma

# Порт по умолчанию
ENV PORT=8080

# Запуск
CMD ["npm", "start"]
