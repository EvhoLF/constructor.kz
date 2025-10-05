FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
FROM base AS build
RUN npm install
COPY . .
RUN npx prisma generate
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build
FROM base AS prod-deps
RUN npm install --omit=dev
COPY prisma ./prisma
RUN npx prisma generate
RUN cp -R node_modules prod_node_modules
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=prod-deps /app/prod_node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/next.config.ts ./
COPY --from=build /app/prisma ./prisma
ENV PORT=8080
CMD ["npm", "start"]