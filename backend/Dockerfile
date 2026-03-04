FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY src ./src
RUN mkdir -p uploads

EXPOSE 5000
CMD ["npm", "start"]
