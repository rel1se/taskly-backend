# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY .env ./
COPY tsconfig*.json ./
COPY apps/gateway ./apps/gateway
COPY libs ./libs

RUN apk update && \
    apk add --no-cache curl openssl && \
    npm ci --include=dev

RUN npx prisma generate --schema=libs/prisma/auth/schema.prisma

# Собираем проект
RUN npm run build auth

# Stage 2: Run
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY .env ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/libs/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client

CMD ["sh", "-c", "sleep 5 && npx prisma migrate deploy --schema=prisma/auth/schema.prisma && node dist/apps/auth/main.js"]
