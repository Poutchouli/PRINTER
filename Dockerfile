# Use the official nginx image from Docker Hub
FROM nginx:alpine

# Copy the custom website files to the nginx web root directory
COPY index.html /usr/share/nginx/html
COPY test.html /usr/share/nginx/html
COPY js/ /usr/share/nginx/html/js/

# Expose port 80 to the outside world
EXPOSE 80