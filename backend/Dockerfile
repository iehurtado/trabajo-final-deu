# ---- deps ----
FROM node:26-slim AS deps
RUN npm i -g corepack && yarn set version stable
WORKDIR /home/node/app
COPY package.json .yarnrc.yml yarn.lock ./
COPY backend/package.json ./backend/
RUN yarn workspaces focus backend

# ---- dev ----
FROM deps AS dev
COPY backend ./backend
USER node
CMD ["yarn", "start:backend"]

# ---- build ----
FROM deps AS build
COPY backend ./backend
RUN yarn workspace backend build

# ---- runtime ----
FROM node:26-slim AS runtime
EXPOSE 3000
WORKDIR /home/node/app
COPY --from=build /home/node/app/backend/dist ./dist
COPY --from=deps /home/node/app/node_modules ./node_modules
USER node
CMD ["node", "dist/main"]
