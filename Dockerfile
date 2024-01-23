FROM node:lts-alpine

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./

RUN npm i -g pm2
RUN npm install
COPY . ./
RUN npm run build

ARG pm2file
ENV file=$pm2file
CMD pm2-runtime start $file