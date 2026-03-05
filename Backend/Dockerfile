FROM node:12-alpine

# Create app directory and set the working dir.
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies.
COPY package*.json /usr/src/app/
RUN npm install

# Copy over the source files.
COPY . /usr/src/app

# Build the nextjs app.
# RUN npm run build
EXPOSE 4547

CMD ["npm", "run", "start"]
