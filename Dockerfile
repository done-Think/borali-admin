FROM node:20-alpine AS base
WORKDIR /app
RUN addgroup -S borali && adduser -S borali -G borali

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM base AS development
COPY --from=deps --chown=borali:borali /app/node_modules ./node_modules
COPY --chown=borali:borali . .
RUN chown -R borali:borali /app
USER borali
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM deps AS builder
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
