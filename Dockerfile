FROM node:lts AS builder

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build

FROM node:lts AS runner

WORKDIR /app

COPY --from=builder /app/build /app

RUN yarn install --production

EXPOSE 3333

ENTRYPOINT [ "node", "server.js" ]
