FROM node:10.14.1

WORKDIR /home/app

COPY package.json .
COPY package-lock.json .
COPY .nvmrc .

RUN npm install

COPY . .

EXPOSE 8080
CMD npm start
