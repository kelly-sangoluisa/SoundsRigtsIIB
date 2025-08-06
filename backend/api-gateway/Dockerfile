FROM node:18-alpine

WORKDIR /app

# Copiar package.json del api gateway
COPY package-simple.json ./package.json

# Instalar dependencias
RUN npm install

# Copiar código del API Gateway
COPY . ./

# Exponer puerto
EXPOSE 3000

# Comando para ejecutar directamente con ts-node
CMD ["npx", "ts-node", "src/main.ts"]
