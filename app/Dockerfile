FROM node:12

WORKDIR /app
RUN apt-get update
RUN npm install -g nodemon &&  npm install @material/button

COPY package.json /app/package.json
RUN npm install -g
COPY . /app

ENV PORT 3000
EXPOSE 3000

CMD npm start
