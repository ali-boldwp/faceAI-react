# --- Build frontend ---
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm i
COPY frontend/ ./
# Pass API base if your frontend needs it at build time:
# ARG VITE_API_URL=/api
# ENV VITE_API_URL=$VITE_API_URL
RUN npm run build    # -> /frontend/dist  (change if it's /build)

RUN ls

# --- Install backend production deps ---
FROM node:20-alpine AS backend-deps
WORKDIR /app
COPY backend/package*.json ./
RUN npm i --only=production

# --- Final image ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# deps
COPY --from=backend-deps /app/node_modules ./node_modules

# backend source
COPY backend/ ./

# copy frontend build into backend/public (match your server.js path)
# If your frontend outputs "build" instead of "dist", adjust the path.
COPY --from=frontend-build /frontend/build ./public

RUN ls

RUN npm install -g nodemon

EXPOSE 5001
CMD ["npm", "start"]
