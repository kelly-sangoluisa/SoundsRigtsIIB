# Script para instalar dependencias y levantar los servicios

Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

Write-Host "Building and starting services with Docker Compose..." -ForegroundColor Green
docker-compose up --build

Write-Host "Services are running!" -ForegroundColor Green
Write-Host "API Gateway: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Auth Service: http://localhost:3001" -ForegroundColor Yellow
Write-Host "Songs Service: http://localhost:3002" -ForegroundColor Yellow
Write-Host "Chat Service: http://localhost:3003" -ForegroundColor Yellow
Write-Host "PostgreSQL: localhost:5432" -ForegroundColor Yellow
