# Use the official Node.js image as a base
FROM node:lts

# Set a working directory in the Docker image
WORKDIR /usr/src/app

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
