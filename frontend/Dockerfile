# Build Stage: Use Node.js Alpine image to build the app
FROM node:20-alpine3.21 AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy application source code
COPY . .

# Build the application for production
RUN npm run build

# Runtime Stage: Use Nginx Alpine image to serve the built app
FROM nginx:alpine

# Copy built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 3000

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

