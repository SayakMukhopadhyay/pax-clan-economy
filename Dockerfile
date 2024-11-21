FROM node:20-bookworm-slim

LABEL org.opencontainers.image.authors=mukhopadhyay@gmail.com
LABEL org.opencontainers.image.title="Pax Clan Economy"
LABEL org.opencontainers.image.description="A Discord bot for intra clan economy in Pax Dei"

WORKDIR /app
RUN chown -R node:node /app
COPY --chown=node:node package*.json ./
USER node
RUN npm ci \
    && npm cache clean --force
ENV PATH=/app/node_modules/.bin:$PATH
COPY --chown=node:node . .

ENV NODE_ENV=production
CMD ["node", "."]