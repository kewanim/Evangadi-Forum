# Use Node.js official image as a base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port defined in the environment variable
EXPOSE 3004

# Start the application
CMD ["npm", "start"]