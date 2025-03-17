# Base stage named "node-app"
FROM node:20 AS node-app

# RUN mkdir -p /app/node-app && chown -R node:node /app/node-app
RUN apt-get update && apt-get install -y mongodb && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock ./

# Install dependencies as root first
RUN yarn install --pure-lockfile

COPY . .

# Switch to node user AFTER dependencies are installed
# USER node

# COPY --chown=node:node . .

EXPOSE 3000
EXPOSE 27017  

CMD mongod --bind_ip 0.0.0.0 --fork --logpath /var/log/mongodb.log && sleep 5 && node src/index.js


# Final image (optional, if needed)
# FROM node:alpine AS final
# WORKDIR /app
# COPY --from=node-app /app .
# CMD ["node", "server.js"]
