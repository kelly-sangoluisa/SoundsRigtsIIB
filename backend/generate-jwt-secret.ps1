# Script para generar JWT_SECRET seguro

Write-Host "🔐 Generador de JWT_SECRET" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Opción 1: Usando .NET Crypto (más seguro)
Write-Host "`n1️⃣ JWT Secret usando criptografía segura:" -ForegroundColor Yellow
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::new()
$rng.GetBytes($bytes)
$cryptoSecret = [Convert]::ToBase64String($bytes)
Write-Host $cryptoSecret -ForegroundColor Green

# Opción 2: UUID + timestamp (buena opción)
Write-Host "`n2️⃣ JWT Secret usando UUID:" -ForegroundColor Yellow
$uuid1 = [System.Guid]::NewGuid().ToString().Replace("-", "")
$uuid2 = [System.Guid]::NewGuid().ToString().Replace("-", "")
$uuidSecret = $uuid1 + $uuid2
Write-Host $uuidSecret -ForegroundColor Green

# Opción 3: Aleatorio con caracteres especiales
Write-Host "`n3️⃣ JWT Secret con caracteres especiales:" -ForegroundColor Yellow
$chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
$randomSecret = -join ((1..64) | ForEach {$chars[(Get-Random -Maximum $chars.Length)]})
Write-Host $randomSecret -ForegroundColor Green

Write-Host "`n💡 Recomendación:" -ForegroundColor Cyan
Write-Host "Usa la opción 1 (criptografía segura) para producción" -ForegroundColor White
Write-Host "La clave debe tener mínimo 32 caracteres" -ForegroundColor White

Write-Host "`n🔧 Para actualizar tu .env:" -ForegroundColor Yellow
Write-Host "Copia uno de los secrets de arriba y reemplaza 'your-secret-key-here-change-in-production'" -ForegroundColor White

Write-Host "`n⚠️  IMPORTANTE:" -ForegroundColor Red
Write-Host "- Nunca compartas tu JWT_SECRET" -ForegroundColor White
Write-Host "- Usa diferentes secrets para desarrollo y producción" -ForegroundColor White
Write-Host "- Si cambias el secret, todos los tokens existentes dejarán de funcionar" -ForegroundColor White
