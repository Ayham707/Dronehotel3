# Use Debian-based Node.js (full glibc)
FROM node:20-bullseye

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port from your .env (default 3006)
EXPOSE 3006

# Start the server
CMD ["node", "server/index.js"]