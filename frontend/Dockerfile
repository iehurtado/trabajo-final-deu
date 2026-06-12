# ---- deps ----
FROM node:26-trixie AS deps
RUN npm i -g corepack @angular/cli@^21 && corepack enable && corepack prepare yarn@stable
WORKDIR /home/node/app
COPY package.json .yarnrc.yml yarn.lock ./
COPY frontend/package.json ./frontend/
RUN yarn workspaces focus frontend

# ---- dev ----
FROM deps AS dev
EXPOSE 4200
COPY frontend ./frontend
USER node
CMD [ "sh", "-c", "yarn start --host 0.0.0.0 --define API_BASE_URL=\\'$API_BASE_URL\\'" ]

# ---- build ----
FROM deps AS build
COPY frontend ./frontend
ARG API_BASE_URL
ENV API_BASE_URL=${API_BASE_URL}
RUN yarn workspace frontend build \
  --configuration=production \
  --define API_BASE_URL='${API_BASE_URL}'

# ---- runtime (nginx) ----
FROM nginx:stable-alpine AS runtime
COPY --from=build /home/node/app/frontend/dist/trabajo-final-deu/browser /usr/share/nginx/html
COPY frontend/nginx/default.conf.template /etc/nginx/templates/

