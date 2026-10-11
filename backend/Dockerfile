FROM node:22-alpine

WORKDIR /app
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --omit=dev
COPY backend/src ./backend/src
COPY mockData.js ./mockData.js
WORKDIR /app/backend
EXPOSE 4000
CMD ["npm", "start"]
