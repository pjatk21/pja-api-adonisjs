FROM node:lts AS builder

WORKDIR /api

COPY . .

RUN npm install -D

RUN npm run build

ENTRYPOINT npm run dev

FROM node:lts AS runner

COPY --from=builder /api/build /api

WORKDIR /api

RUN npm install

EXPOSE 3333

ENTRYPOINT npm start
