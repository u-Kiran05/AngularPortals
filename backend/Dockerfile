FROM node:22.1.0-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Copy .env (only if not using docker-compose `env_file`)
COPY .env .env

EXPOSE 3000

CMD ["node", "server.js"]
