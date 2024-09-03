FROM node:lts

WORKDIR /react

# Needed for npm install steps
COPY package*.json .

RUN npm install
RUN npm install --save react-router-dom
RUN npm install serve -g

COPY . .

RUN npm run build

COPY /dist /dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]