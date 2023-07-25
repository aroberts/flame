FROM node:16-alpine3.11 as builder

RUN apk --no-cache --virtual build-dependencies add python python3 make g++

# Get package.json and install modules
COPY package*.json /tmp/package.json
RUN cd /tmp && npm install --production
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

# Get package.json and install modules
COPY client/package*.json /tmp_client/package.json
RUN cd /tmp_client && npm install --production
RUN mkdir -p /app/client && cp -a /tmp_client/node_modules /app/client/

WORKDIR /app

COPY . .

RUN mkdir -p ./public ./data \
    && cd ./client \
    && npm install --production \
    && npm run build \
    && cd .. \
    && mv ./client/build/* ./public \
    && rm -rf ./client

FROM node:16-alpine3.11

COPY --from=builder /app /app

WORKDIR /app

RUN chown -R node:node .

EXPOSE 5005

USER node

ENV NODE_ENV=production
ENV PASSWORD=flame_password

CMD ["node", "server.js"]
