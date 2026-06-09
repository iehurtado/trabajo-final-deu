# ---- deps ----
FROM node:22-alpine AS deps
RUN npm i -g corepack @angular/cli@^21 && yarn set version stable
WORKDIR /app
COPY package.json .yarnrc.yml yarn.lock ./
COPY frontend/package.json ./frontend/
RUN yarn workspaces focus frontend

# ---- build ----
FROM deps AS build
COPY frontend ./frontend
RUN yarn workspace frontend build

# ---- runtime (nginx) ----
FROM nginx:stable-alpine AS runtime
COPY --from=build /app/frontend/dist/trabajo-final-deu/browser /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
