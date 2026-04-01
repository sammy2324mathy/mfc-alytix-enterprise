FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=${VITE_API_URL}

COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
