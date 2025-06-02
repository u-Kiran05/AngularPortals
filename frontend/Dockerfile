FROM node:22.16.0-slim as build
WORKDIR /app
COPY package*.json /app/
RUN npm install
RUN npx ngcc -- properties es2023 browser module main -- first-only -- create-ivy-entry-points
RUN npm run build
FROM  nginx:stable
COPY --from=build /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
