FROM node:18-alpine

WORKDIR /app

# Copiar package.json del chat service
COPY package-simple.json ./package.json

# Instalar dependencias
RUN npm install

# Copiar código del Chat Service
COPY . ./

# Exponer puerto
EXPOSE 3003

# Comando para ejecutar directamente con ts-node
CMD ["npx", "ts-node", "src/main.ts"]
