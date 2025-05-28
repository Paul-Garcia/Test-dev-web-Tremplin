# Dockerfile pour Next.js

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


EXPOSE 3000

CMD ["npm", "run", "start", "--", "-H", "0.0.0.0"]
