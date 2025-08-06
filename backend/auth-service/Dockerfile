# Usar imagen oficial de Node.js
FROM node:18-alpine

# Crear directorio de la aplicación
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo dev para desarrollo)
RUN npm install

# Copiar código fuente
COPY . .

# Exponer el puerto
EXPOSE 3001

# Comando por defecto (puede ser sobrescrito en docker-compose)
CMD ["npm", "run", "start:dev"]
