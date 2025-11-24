# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including tsx for init script)
RUN npm ci

# Copy built app from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./

# Copy initialization scripts
COPY scripts ./scripts

# Create directory for SQLite database
RUN mkdir -p /app/data

# Expose port (Cloud Run will set PORT env variable)
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/app/data/app.db

# Start the app with initialization
CMD ["npm", "run", "start"]
