FROM node:14.17.0

WORKDIR /usr/app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 8082

CMD ["npm", "start"]
