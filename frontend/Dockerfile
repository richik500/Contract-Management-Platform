# Upgrade to Node 20 to fix the crypto.hash error
FROM node:20-slim
WORKDIR /app

# Install build essentials for certain npm packages
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

# Run build without strict CI mode to avoid warning-related crashes
RUN CI=false npm run build

# Use serve to host the static build
RUN npm install -g serve
EXPOSE 5173

# Serve the 'dist' folder on port 5173
CMD ["serve", "-s", "dist", "-l", "5173"]