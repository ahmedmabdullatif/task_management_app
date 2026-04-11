# Stage 1: Build Stage
FROM node:22 as build
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
# Build production version via Vite
RUN npm run build

# Stage 2: Production Stage
FROM nginx:alpine
# Copy built files from the first stage to Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html
# Expose default web port
EXPOSE 80
# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]