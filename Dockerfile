FROM node:20

WORKDIR . 

COPY package.json .

COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn build 

CMD ["yarn", "start"]