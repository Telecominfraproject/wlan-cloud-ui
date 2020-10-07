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
COPY app/commit.properties ./

#RUN npm install
# If you are building your code for production
RUN (echo "@tip-wlan:registry=https://tip.jfrog.io/artifactory/api/npm/tip-wlan-cloud-npm-repo/" && echo "//tip.jfrog.io/artifactory/api/npm/tip-wlan-cloud-npm-repo/:_authToken=$NPM_TOKEN") > .npmrc
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent
RUN rm -f .npmrc
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
RUN apk add --no-cache jq
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker_entrypoint.sh generate_config_js.sh /
RUN chmod +x docker_entrypoint.sh generate_config_js.sh
 
EXPOSE 80
ENTRYPOINT ["/docker_entrypoint.sh"]
