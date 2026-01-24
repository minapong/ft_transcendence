#build stage
FROM node:20-bullseye-slim AS build
WORKDIR /app
RUN apt-get update && \
    apt-get install -y sqlite3 build-essential python3 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
COPY package*.json tsconfig.json ./
RUN npm ci
COPY prisma ./prisma
COPY prisma.config.js ./
RUN  npx prisma generate
COPY src ./src
RUN npm run build

#production stage
FROM node:20-bullseye-slim
WORKDIR /app
COPY package*.json ./

RUN npm ci --omit=dev
COPY prisma ./prisma
COPY prisma.config.js ./

COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma

COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]

