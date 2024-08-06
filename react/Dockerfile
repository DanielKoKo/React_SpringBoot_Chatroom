FROM node:lts

WORKDIR /react
COPY package*.json .

RUN npm install
RUN npm install --save react-router-dom
RUN npm install serve -g

COPY . .

RUN npm run build

COPY . .

EXPOSE 3000

CMD ["serve", "-s", "dist"]