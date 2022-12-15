# Dockerfile

# base image
FROM node:16.13

# create & set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

#install dependencies
COPY package-lock.json /usr/src/
COPY package.json /usr/src/
RUN npm set-script prepare ""
RUN npm ci

# copy source files
COPY . /usr/src

# build app
RUN npm run build
EXPOSE 3000

# run the app
ENTRYPOINT ["npm", "run", "start"]
