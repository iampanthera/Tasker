FROM node:18

# Install libc6-compat
# RUN apk --no-cache add libc6-compat

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build and start the application
CMD ["npm", "run", "start"]
