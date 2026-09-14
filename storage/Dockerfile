# Zero runtime dependencies (see server.js), so the image is just Node
# running one file. Alpine keeps it small; the service does no native
# compilation so the slim variant is unnecessary.
FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY server.js ./

ENV PORT=8787
ENV DATA_DIR=/data

# node:22-alpine already has a non-root 'node' user (uid/gid 1000). Chown
# /data here so a fresh named volume - which Docker seeds from the image's
# directory on first creation - inherits writable ownership for that user,
# matching the `user: '1000:1000'` compose sets for read_only + non-root.
RUN mkdir -p /data/cards && chown -R node:node /data /app

USER node

EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8787)+'/healthz').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
