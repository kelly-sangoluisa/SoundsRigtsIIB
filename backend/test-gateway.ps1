# Script de prueba para el API Gateway

Write-Host "🌐 TESTING API GATEWAY - SONGS & LICENSES" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$gatewayUrl = "http://localhost:3100/api/v1"

Write-Host "`n1. Verificando API Gateway..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3100/health" -UseBasicParsing
    Write-Host "✅ API Gateway: OK" -ForegroundColor Green
} catch {
    Write-Host "❌ API Gateway: Error - $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n2. Probando canciones disponibles via Gateway..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$gatewayUrl/songs/available" -UseBasicParsing
    $availableData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Canciones disponibles: $($availableData.total) canciones" -ForegroundColor Green
    if ($availableData.songs.Count -gt 0) {
        $firstSong = $availableData.songs[0]
        Write-Host "   Primera canción: '$($firstSong.name)' - Precio: $($firstSong.price)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Canciones disponibles: Error - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Probando mis canciones via Gateway..." -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer mock-jwt-token"
        "user-id" = "1"
    }
    $response = Invoke-WebRequest -Uri "$gatewayUrl/songs/mine" -UseBasicParsing -Headers $headers
    $songsData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Mis canciones: $($songsData.total) canciones encontradas" -ForegroundColor Green
} catch {
    Write-Host "❌ Mis canciones: Error - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4. Probando licencias compradas via Gateway..." -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer mock-jwt-token"
        "user-id" = "1"
    }
    $response = Invoke-WebRequest -Uri "$gatewayUrl/licenses/purchased" -UseBasicParsing -Headers $headers
    $licensesData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Licencias compradas: $($licensesData.licenses.Count) licencias" -ForegroundColor Green
} catch {
    Write-Host "❌ Licencias compradas: Error - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 API Gateway funcionando correctamente!" -ForegroundColor Green
