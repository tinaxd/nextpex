FROM node:lts AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json /usr/src/app/
RUN npm install

ENV NODE_ENV=production
COPY . /usr/src/app/
RUN npm run build

FROM httpd:alpine

COPY --from=builder /usr/src/app/dist /usr/local/apache2/htdocs/
