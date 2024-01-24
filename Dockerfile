# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

#Include Environment variables
ARG MONGODB_URL_PARAM
ENV MONGODB_URL=${MONGODB_URL_PARAM}

# Expose the port on which the application will run
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]
