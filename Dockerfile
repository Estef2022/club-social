FROM node:18-alpine

WORKDIR /club-social-api

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]