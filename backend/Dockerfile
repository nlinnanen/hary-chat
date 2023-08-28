# Dockerfile
FROM node:18
# Set environment to production
ENV NODE_ENV=production
# Copy the configuration files
WORKDIR /opt/
COPY ./package.json ./package-lock.json ./
ENV PATH /opt/node_modules/.bin:$PATH
# Install dependencies
RUN npm install
# Copy the application files
WORKDIR /opt/app
COPY ./ .
# Build the Strapi application
RUN npm run build
# Expose the Strapi port
EXPOSE 1337
# Start the Strapi application
CMD ["npm", "run", "start"]
