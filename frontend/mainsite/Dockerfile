ARG NODE_VERSION=26

FROM node:${NODE_VERSION}-slim AS base

# Enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g corepack

RUN corepack enable

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml files to the working directory
COPY package.json pnpm-lock.yaml .npmrc ./

FROM base AS prod-dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod

FROM prod-dependencies AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# Copy the rest of the application files to the working directory
COPY . .

# Build the application
RUN pnpm run build

FROM node:${NODE_VERSION}-slim AS production

# Set the working directory inside the container
WORKDIR /app

COPY --from=prod-dependencies /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

# Define environment variables
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# Expose the port the application will run on
EXPOSE 3000

# Start the application
CMD [ "node", "/server/index.mjs" ]
