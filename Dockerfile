FROM node:12.16.3

WORKDIR /home/app

COPY package.json .
COPY package-lock.json .
COPY .nvmrc .

RUN npm install

COPY . .

EXPOSE 8080
CMD npm start
