FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY . .
CMD ["serve", "-s", ".", "-l", "80"]
