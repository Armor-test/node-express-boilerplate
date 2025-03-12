# Base stage named "node-app"
FROM node:alpine AS node-app

RUN mkdir -p node-app && chown -R node:node node-app

WORKDIR /app

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3000

# Final image (optional, if needed)
FROM node:alpine AS final
WORKDIR /app
COPY --from=node-app /app .
CMD ["node", "server.js"]
