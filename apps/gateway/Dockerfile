# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY .env ./
COPY tsconfig*.json ./
COPY apps/gateway ./apps/gateway
COPY libs ./libs

RUN npm ci
RUN npm run build gateway

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY .env ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "dist/apps/gateway/main.js"]
