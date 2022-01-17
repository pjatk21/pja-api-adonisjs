FROM node:lts-alpine AS builder

# Dependencies
RUN apk add chromium ca-certificates build-base git bash

RUN adduser -D -s /bin/bash adonis

USER adonis

ENV PUPPETEER_SKIP_DOWNLOAD=true\
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /api

COPY package.json .

RUN yarn install

COPY . .

RUN yarn run build

FROM node:lts-alpine AS runner

COPY --from=builder /api/build /api

WORKDIR /api

RUN yarn install

EXPOSE 3333

ENTRYPOINT yarn start
