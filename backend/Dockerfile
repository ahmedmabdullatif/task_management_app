# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files and install first (to leverage caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port where the backend will run
EXPOSE 5001

# Command to run the server
CMD ["npm", "start"]