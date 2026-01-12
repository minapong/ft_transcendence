#build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY prisma ./prisma
COPY prisma.config.js ./
RUN  npx prisma generate
COPY src ./src
RUN npm run build

#production stage
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma

COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
