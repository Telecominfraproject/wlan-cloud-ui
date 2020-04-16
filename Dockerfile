# build environment
FROM node:13.12.0-alpine as build

ARG NPM_TOKEN

# Create app directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

#RUN npm install
# If you are building your code for production
RUN (echo "@tip-wlan:registry=https://tip.jfrog.io/artifactory/api/npm/tip-wlan-cloud-npm-repo/" && echo "//tip.jfrog.io/artifactory/api/npm/tip-wlan-cloud-npm-repo/:_authToken=$NPM_TOKEN") > .npmrc
RUN npm ci --only=production
RUN rm -f .npmrc

#copy build to hide NPM TOKEN
FROM node:13.12.0-alpine

WORKDIR /app

COPY --from=build /app /app

CMD [ "npm", "run", "build" ]

# production environment
FROM nginx:stable-alpine
COPY --from=dist /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]