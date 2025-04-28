# Build stage: Use the official Node.js image based on Alpine 3.21.3
FROM node:20-alpine3.21 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy the rest of the application files to the working directory
COPY . .

# Runtime stage: Use the official Alpine 3.21.3 image
FROM alpine:3.21.3

# Set the working directory inside the container
WORKDIR /app

# Install Node.js and npm in the runtime stage
RUN apk add --no-cache nodejs npm

# Install PM2 globally in the runtime stage
RUN npm install -g pm2

# Copy necessary files from the build stage
COPY --from=build /app /app

# Expose the application port
EXPOSE 5000

# Start the application using PM2 in non-daemon mode
CMD ["pm2", "start", "server.js", "--name", "todo-backend", "--env", "production", "--no-daemon"]

