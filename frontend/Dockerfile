# Stage 1: Build Image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package descriptors 
COPY package*.json ./

# Install Dependencies
RUN npm ci

# Copy application source
COPY . .

# Build the Frontend 
RUN npm run build

# Stage 2: Serve via Nginx
FROM nginx:alpine

# Remove default nginx static resources
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy proxy setup and router config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP Port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
