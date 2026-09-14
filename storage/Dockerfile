# Zero runtime dependencies (see server.js), so the image is just Node
# running one file. Alpine keeps it small; the service does no native
# compilation so the slim variant is unnecessary.
FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY server.js ./

ENV PORT=8787
ENV DATA_DIR=/data

RUN mkdir -p /data/cards

EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8787)+'/healthz').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
