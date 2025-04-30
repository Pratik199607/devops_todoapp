# Stage 1: Build the React app (with minimal dependencies)
FROM node:20-alpine3.21

# Set the working directory
WORKDIR /app

# Copy only the package files (package.json and package-lock.json) first for caching purposes
COPY package.json package-lock.json ./

# Install only the production dependencies
RUN npm install 

COPY . .
# Expose the Vite default dev server port
EXPOSE 3000

# Start the Vite development server
CMD ["npm", "run", "dev"]

