FROM node:lts AS builder

WORKDIR /app

COPY . .

RUN npm install -D

RUN npm run build

FROM node:lts AS runner

WORKDIR /app

COPY --from=builder /app/build /app

RUN npm install

EXPOSE 3333

ENTRYPOINT npm run migrate && npm start
