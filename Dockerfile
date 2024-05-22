FROM node:20-alpine

WORKDIR /app
COPY . .

COPY .env .env

RUN yarn
