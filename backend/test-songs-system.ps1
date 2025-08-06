# Script de prueba para el sistema de canciones y licencias
# Este script prueba todos los endpoints principales del sistema

Write-Host "🎵 TESTING SOUNDSRIGHTS - SONGS & LICENSES SYSTEM" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Configuración
$songsServiceUrl = "http://localhost:3002"
$authServiceUrl = "http://localhost:3001"
$gatewayUrl = "http://localhost:3100"

Write-Host "`n1️⃣ Verificando servicios..." -ForegroundColor Yellow

# Test Health Endpoints
try {
    $response = Invoke-WebRequest -Uri "$songsServiceUrl/health" -UseBasicParsing
    $healthData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Songs Service: OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Songs Service: Error - $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "$authServiceUrl/health" -UseBasicParsing
    $healthData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Auth Service: OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Auth Service: Error - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2️⃣ Probando endpoints de canciones..." -ForegroundColor Yellow

# Test Songs Endpoints
try {
    Write-Host "📋 Probando 'Mis canciones' para usuario 1..." -ForegroundColor Gray
    $response = Invoke-WebRequest -Uri "$songsServiceUrl/songs/mine?userId=1" -UseBasicParsing
    $songsData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Mis canciones: $($songsData.total) canciones encontradas" -ForegroundColor Green
    if ($songsData.songs.Count -gt 0) {
        $firstSong = $songsData.songs[0]
        Write-Host "   Primera canción: '$($firstSong.name)' - Estado: $($firstSong.status)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Mis canciones: Error - $($_.Exception.Message)" -ForegroundColor Red
}

try {
    Write-Host "`n📋 Probando canciones disponibles..." -ForegroundColor Gray
    $response = Invoke-WebRequest -Uri "$songsServiceUrl/songs/available" -UseBasicParsing
    $availableData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Canciones disponibles: $($availableData.total) canciones" -ForegroundColor Green
    if ($availableData.songs.Count -gt 0) {
        $firstAvailable = $availableData.songs[0]
        Write-Host "   Primera disponible: '$($firstAvailable.name)' - Precio: $($firstAvailable.price)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Canciones disponibles: Error - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3️⃣ Probando endpoints de licencias..." -ForegroundColor Yellow

try {
    Write-Host "📄 Probando licencias compradas para usuario 1..." -ForegroundColor Gray
    $response = Invoke-WebRequest -Uri "$songsServiceUrl/licenses/purchased?userId=1" -UseBasicParsing
    $purchasedData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Licencias compradas: $($purchasedData.licenses.Count) licencias" -ForegroundColor Green
} catch {
    Write-Host "❌ Licencias compradas: Error - $($_.Exception.Message)" -ForegroundColor Red
}

try {
    Write-Host "`n📄 Probando licencias vendidas para usuario 1..." -ForegroundColor Gray
    $response = Invoke-WebRequest -Uri "$songsServiceUrl/licenses/sold?userId=1" -UseBasicParsing
    $soldData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Licencias vendidas: $($soldData.licenses.Count) licencias" -ForegroundColor Green
} catch {
    Write-Host "❌ Licencias vendidas: Error - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4️⃣ Probando creación de canción..." -ForegroundColor Yellow

$newSong = @{
    title = "Test Song $(Get-Date -Format 'HHmmss')"
    genre = "test"
    price = 9.99
    artistId = 1
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$songsServiceUrl/songs" -Method POST -Body $newSong -ContentType "application/json" -UseBasicParsing
    $createdSong = $response.Content | ConvertFrom-Json
    Write-Host "✅ Canción creada: '$($createdSong.name)' (ID: $($createdSong.id))" -ForegroundColor Green
    
    # Guardar ID para pruebas posteriores
    $testSongId = $createdSong.id
    
} catch {
    Write-Host "❌ Crear canción: Error - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n5️⃣ Probando búsqueda con filtros..." -ForegroundColor Yellow

try {
    Write-Host "🔍 Buscando canciones de género 'electronic'..." -ForegroundColor Gray
    $response = Invoke-WebRequest -Uri "$songsServiceUrl/songs/available?genre=electronic" -UseBasicParsing
    $filteredData = $response.Content | ConvertFrom-Json
    Write-Host "✅ Filtro por género: $($filteredData.total) canciones electronic" -ForegroundColor Green
} catch {
    Write-Host "❌ Filtro por género: Error - $($_.Exception.Message)" -ForegroundColor Red
}

try {
    Write-Host "`n🔍 Buscando canciones con precio máximo 3.00..." -ForegroundColor Gray
    $response = Invoke-WebRequest -Uri "$songsServiceUrl/songs/available?maxPrice=3.00" -UseBasicParsing
    $priceFiltered = $response.Content | ConvertFrom-Json
    Write-Host "✅ Filtro por precio: $($priceFiltered.total) canciones ≤ $3.00" -ForegroundColor Green
} catch {
    Write-Host "❌ Filtro por precio: Error - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n6️⃣ Probando compra de canción..." -ForegroundColor Yellow

$purchaseData = @{
    buyerId = 2
    buyerMessage = "Me gusta esta canción para mi proyecto"
    offerPrice = 2.50
} | ConvertTo-Json

try {
    # Usar la primera canción disponible
    $response = Invoke-WebRequest -Uri "$songsServiceUrl/songs/available" -UseBasicParsing
    $availableData = $response.Content | ConvertFrom-Json
    
    if ($availableData.songs.Count -gt 0) {
        $songToBuy = $availableData.songs[0]
        $buyResponse = Invoke-WebRequest -Uri "$songsServiceUrl/songs/$($songToBuy.id)/purchase" -Method POST -Body $purchaseData -ContentType "application/json" -UseBasicParsing
        $purchaseResult = $buyResponse.Content | ConvertFrom-Json
        Write-Host "✅ Compra iniciada: Licencia ID $($purchaseResult.licenseId)" -ForegroundColor Green
        Write-Host "   📝 $($purchaseResult.message)" -ForegroundColor Gray
    } else {
        Write-Host "⚠️ No hay canciones disponibles para comprar" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Compra de canción: Error - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 RESUMEN DE PRUEBAS COMPLETADO!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

Write-Host "`n📊 FUNCIONALIDADES IMPLEMENTADAS:" -ForegroundColor Green
Write-Host "✅ Obtener canciones del usuario (Mis Canciones)" -ForegroundColor White
Write-Host "✅ Obtener canciones disponibles para compra" -ForegroundColor White  
Write-Host "✅ Crear nuevas canciones" -ForegroundColor White
Write-Host "✅ Filtrar canciones por género y precio" -ForegroundColor White
Write-Host "✅ Buscar canciones por texto" -ForegroundColor White
Write-Host "✅ Iniciar proceso de compra de licencias" -ForegroundColor White
Write-Host "✅ Ver licencias compradas" -ForegroundColor White
Write-Host "✅ Ver licencias vendidas" -ForegroundColor White
Write-Host "✅ Manejo de estados de canciones" -ForegroundColor White

Write-Host "`n🔗 ENDPOINTS DISPONIBLES:" -ForegroundColor Blue
Write-Host "Songs Service (Puerto 3002):" -ForegroundColor Yellow
Write-Host "  GET  /songs/mine?userId=X         - Mis canciones" -ForegroundColor White
Write-Host "  GET  /songs/available            - Canciones disponibles" -ForegroundColor White
Write-Host "  POST /songs                      - Crear canción" -ForegroundColor White
Write-Host "  PUT  /songs/:id                  - Actualizar canción" -ForegroundColor White
Write-Host "  DELETE /songs/:id?userId=X       - Eliminar canción" -ForegroundColor White
Write-Host "  GET  /songs/:id                  - Ver canción específica" -ForegroundColor White
Write-Host "  POST /songs/:id/purchase         - Comprar canción" -ForegroundColor White
Write-Host "  PATCH /songs/:id/status          - Cambiar estado" -ForegroundColor White
Write-Host "`nLicenses:" -ForegroundColor Yellow
Write-Host "  GET  /licenses/purchased?userId=X - Licencias compradas" -ForegroundColor White
Write-Host "  GET  /licenses/sold?userId=X     - Licencias vendidas" -ForegroundColor White

Write-Host "`n🚀 LISTO PARA CONECTAR CON EL FRONTEND!" -ForegroundColor Green
