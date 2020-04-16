# build environment
FROM node:13.12.0-alpine as build

ARG SSH_KEY

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


RUN npm ci --only=production

# Bundle app source
COPY . .

CMD [ "npm", "run", "build" ]

# production environment
FROM nginx:stable-alpine
COPY --from=dist /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]