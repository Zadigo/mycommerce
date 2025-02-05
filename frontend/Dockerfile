# # Use the official Node.js image as the base image
# FROM node:18-alpine

# RUN npm install -g pnpm

# # Set the working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# # Install dependencies
# RUN pnpm install

# # Copy the rest of the application code
# COPY . .

# # Build the Nuxt.js application
# RUN pnpm run build

# # Expose the port Nuxt.js runs on (default is 3000)
# EXPOSE 3000

# # Start the Nuxt.js application
# CMD [ "pnpm", "start" ]

# Stage 1: Build the application
FROM node:18-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml* ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the Nuxt.js application for production
RUN pnpm run build

# Stage 2: Serve the application
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the production build from the builder stage
COPY --from=builder /app/.output ./.output

# Expose the port Nuxt.js runs on (default is 3000)
EXPOSE 3000

# Start the Nuxt.js application using node
CMD [ "node", ".output/server/index.mjs" ]
