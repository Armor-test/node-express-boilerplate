# Base stage named "node-app"
FROM node:alpine AS node-app

RUN mkdir -p /app/node-app && chown -R node:node /app/node-app

WORKDIR /app

COPY package.json yarn.lock ./

# Install dependencies as root first
RUN yarn install --pure-lockfile

# Switch to node user AFTER dependencies are installed
USER node

COPY --chown=node:node . .

EXPOSE 3000

# Final image (optional, if needed)
FROM node:alpine AS final
WORKDIR /app
COPY --from=node-app /app .
CMD ["node", "server.js"]
