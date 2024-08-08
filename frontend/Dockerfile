# Dockerfile

# Step 1: Build stage
FROM node:alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Step 2: Serve stage
FROM nginx:alpine

# Copy build files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the Nginx configuration template
COPY nginx/nginx.conf.template /etc/nginx/nginx.conf.template

# Copy a script that replaces environment variables in the Nginx configuration
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 80 for the Nginx server
EXPOSE 80

# Set the entrypoint script
ENTRYPOINT ["/entrypoint.sh"]

# Default command for Nginx
CMD ["nginx", "-g", "daemon off;"]
