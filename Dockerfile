# Use the official Ubuntu 22.04 image as a base
FROM ubuntu:22.04

# Set a working directory in the Docker image
WORKDIR /usr/src/app

# Update package lists and install necessary dependencies
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy all other application code
COPY . .

# Expose the port that your app runs on
EXPOSE 3000

# Command to run your application
CMD ["node", "knud.js"]
