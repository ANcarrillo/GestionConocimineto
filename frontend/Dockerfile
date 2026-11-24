# Capa 1 - PWA React: se compila con Node y se publica con Nginx

# 1) Compilación
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# En Docker el navegador llama a la API por el mismo dominio (/api); Nginx la reenvía al backend
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# 2) Publicación
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
