FROM node:18-alpine

WORKDIR /app

# Copiar package.json del songs service
COPY package-simple.json ./package.json

# Instalar dependencias
RUN npm install

# Copiar código del Songs Service
COPY . ./

# Exponer puerto
EXPOSE 3002

# Comando para ejecutar directamente con ts-node
CMD ["npx", "ts-node", "src/main.ts"]
