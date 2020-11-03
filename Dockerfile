FROM node:lts-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY public/ public/
COPY src/ src/
COPY styles/ styles/
COPY webpack.config.js .babelrc ./

ARG CONF_TOKEN
ENV CONF_TOKEN=${CONF_TOKEN}

ARG STAGING_TOKEN
ENV STAGING_TOKEN=${STAGING_TOKEN}

ARG QA_IN_TOKEN
ENV QA_IN_TOKEN=${QA_IN_TOKEN}

RUN npm run build

# Serve dist

FROM caddy:2.1.1-alpine
ENV ENABLE_TELEMETRY="false"

WORKDIR /app
COPY configs/certs/ /app/certs/
COPY --from=0 /app/dist /app/dist
