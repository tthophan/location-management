# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app
FROM base as deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --production --frozen-lockfile

# Create a new stage to build the application.
FROM deps as build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile
COPY . .
RUN yarn run build
# Create a new stage to run the application.
FROM base as final
ENV NODE_ENV production
ENV PORT=$PORT

USER node
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE $PORT

ENTRYPOINT ["node","./dist/src/main.js", ">", "/dev/stdout"]
