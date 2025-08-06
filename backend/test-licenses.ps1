# Script para obtener datos de licencias

Write-Host "🎫 Probando Endpoints de Licencias" -ForegroundColor Green

$apiGateway = "http://localhost:3000"

# Primero necesitas hacer login para obtener el token
Write-Host "`n1️⃣ Haz login primero:" -ForegroundColor Yellow
Write-Host "POST $apiGateway/auth/login" -ForegroundColor White

# Ejemplo de login
$loginData = @{
    email = "tu@email.com"
    password = "tupassword"
} | ConvertTo-Json

Write-Host "`n📄 Ejemplo de login:" -ForegroundColor Cyan
Write-Host $loginData -ForegroundColor Gray

Write-Host "`n2️⃣ Una vez que tengas el token, puedes obtener licencias:" -ForegroundColor Yellow

# Headers con token (reemplaza YOUR_TOKEN con el token real)
$headers = @{ 
    Authorization = "Bearer YOUR_TOKEN"
    "Content-Type" = "application/json"
}

Write-Host "`n🛒 Licencias Compradas:" -ForegroundColor Cyan
Write-Host "GET $apiGateway/songs/licenses/purchased" -ForegroundColor White

Write-Host "`n💰 Licencias Vendidas:" -ForegroundColor Cyan  
Write-Host "GET $apiGateway/songs/licenses/sold" -ForegroundColor White

Write-Host "`n📋 Estructura de datos de respuesta:" -ForegroundColor Yellow
Write-Host @"
{
  "licenses": [
    {
      "id": 1,
      "songId": 123,
      "songTitle": "Mi Canción",
      "artistName": "Nombre del Artista",
      "buyerName": "Nombre del Comprador",
      "price": 9.99,
      "purchaseDate": "2024-01-15T10:00:00Z"
    }
  ]
}
"@ -ForegroundColor Gray

Write-Host "`n🔧 Ejemplo completo de uso:" -ForegroundColor Yellow

$exampleScript = @"
# 1. Login
`$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

`$loginResponse = Invoke-RestMethod -Uri "$apiGateway/auth/login" -Method POST -Body `$loginBody -ContentType "application/json"
`$token = `$loginResponse.access_token

# 2. Obtener licencias compradas
`$headers = @{ Authorization = "Bearer `$token" }
`$purchasedLicenses = Invoke-RestMethod -Uri "$apiGateway/songs/licenses/purchased" -Headers `$headers

# 3. Obtener licencias vendidas
`$soldLicenses = Invoke-RestMethod -Uri "$apiGateway/songs/licenses/sold" -Headers `$headers

# 4. Mostrar resultados
Write-Host "Licencias Compradas: `$(`$purchasedLicenses.licenses.Count)"
Write-Host "Licencias Vendidas: `$(`$soldLicenses.licenses.Count)"
"@

Write-Host $exampleScript -ForegroundColor Gray
