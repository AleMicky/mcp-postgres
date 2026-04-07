FROM node:20

WORKDIR /app

# copiar dependencias
COPY package*.json ./
RUN npm install

# copiar código
COPY . .

# compilar TypeScript
RUN npm run build

# puerto (no obligatorio para MCP stdio, pero útil si luego usas HTTP)
EXPOSE 3000

CMD ["node", "build/index.js"]