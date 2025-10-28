# ========================
# Base stage
# ========================
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl

COPY package*.json ./

# ========================
# Build stage
# ========================
FROM base AS build
RUN npm ci
COPY . .
RUN npx prisma generate
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

# ========================
# Production deps
# ========================
FROM base AS prod
RUN npm ci --omit=dev
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./ 
COPY --from=build /app/prisma ./prisma
RUN npx prisma generate

ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]
