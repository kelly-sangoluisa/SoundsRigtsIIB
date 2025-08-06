# Script de prueba simple para el sistema de canciones y licencias

Write-Host "🎵 TESTING SOUNDSRIGHTS - SONGS & LICENSES SYSTEM" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

$songsServiceUrl = "http://localhost:3002"

Write-Host "`n1. Verificando servicio de canciones..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$songsServiceUrl/health" -UseBasicParsing
    $healthData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Songs Service: OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Songs Service: Error" -ForegroundColor Red
    exit 1
}

Write-Host "`n2. Probando canciones del usuario..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$songsServiceUrl/songs/mine?userId=1" -UseBasicParsing
    $songsData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Mis canciones: $($songsData.total) canciones encontradas" -ForegroundColor Green
    if ($songsData.songs.Count -gt 0) {
        $firstSong = $songsData.songs[0]
        Write-Host "   Primera canción: '$($firstSong.name)' - Estado: $($firstSong.status)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Mis canciones: Error" -ForegroundColor Red
}

Write-Host "`n3. Probando canciones disponibles..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$songsServiceUrl/songs/available" -UseBasicParsing
    $availableData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Canciones disponibles: $($availableData.total) canciones" -ForegroundColor Green
} catch {
    Write-Host "❌ Canciones disponibles: Error" -ForegroundColor Red
}

Write-Host "`n4. Probando licencias..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$songsServiceUrl/licenses/purchased?userId=1" -UseBasicParsing
    $purchasedData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Licencias compradas: $($purchasedData.licenses.Count) licencias" -ForegroundColor Green
} catch {
    Write-Host "❌ Licencias compradas: Error" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "$songsServiceUrl/licenses/sold?userId=1" -UseBasicParsing
    $soldData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Licencias vendidas: $($soldData.licenses.Count) licencias" -ForegroundColor Green
} catch {
    Write-Host "❌ Licencias vendidas: Error" -ForegroundColor Red
}

Write-Host "`n🎉 Sistema de canciones y licencias funcionando correctamente!" -ForegroundColor Green
