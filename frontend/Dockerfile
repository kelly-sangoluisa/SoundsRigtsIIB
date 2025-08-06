FROM node:lts-alpine
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
RUN npm ci

# Copiar el código fuente
COPY . .

# Construir la aplicación sin linting estricto
ENV CI=false
ENV ESLINT_NO_DEV_ERRORS=true
ENV TSC_COMPILE_ON_ERROR=true
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
