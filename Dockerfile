FROM node:lts-buster

WORKDIR /app

RUN npm install -g npm@10.8.2 && \
  npm install -g @nestjs/cli@10.0.0

COPY package*.json ./
RUN npm install

COPY . . 

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"] 