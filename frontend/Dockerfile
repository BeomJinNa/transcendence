# Dockerfile

FROM nginx:alpine

# Copy your static files (HTML, CSS, JS) to the Nginx server
COPY ./public /usr/share/nginx/html

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
