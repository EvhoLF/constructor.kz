FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

# 1. Копируем package файлы
COPY package*.json ./

# 2. Устанавливаем зависимости
RUN npm install

# 3. Копируем schema.prisma
COPY schema.prisma ./

# 4. Генерируем Prisma Client с явным указанием пути
RUN npx prisma generate --schema=./schema.prisma

# 5. Копируем остальной код
COPY . .

# 6. Собираем приложение
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]