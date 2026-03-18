# ================================
# Stage 1: Install Dependencies
# ================================
FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

# ================================
# Stage 2: Deploy the app
# ================================
FROM node:22-alpine AS deploy

ENV PORT=3000
ENV NODE_ENV=Development

WORKDIR /app

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy prod dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "app.js"]
