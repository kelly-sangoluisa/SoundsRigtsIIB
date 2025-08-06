# Script para probar endpoints del backend SoundsRights

Write-Host "🎵 Probando Backend SoundsRights" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# URLs base
$apiGateway = "http://localhost:3100"
$authService = "http://localhost:3001"
$songsService = "http://localhost:3002"
$chatService = "http://localhost:3003"

Write-Host "`n📍 Endpoints Disponibles:" -ForegroundColor Yellow

Write-Host "`n🔐 AUTENTICACIÓN (API Gateway - Puerto 3100)" -ForegroundColor Cyan
Write-Host "POST $apiGateway/api/v1/auth/login" -ForegroundColor White
Write-Host "POST $apiGateway/api/v1/auth/register" -ForegroundColor White
Write-Host "GET  $apiGateway/api/v1/auth/profile (requiere JWT)" -ForegroundColor White
Write-Host "GET  $apiGateway/api/v1/auth/validate (requiere JWT)" -ForegroundColor White

Write-Host "`n🎵 CANCIONES (API Gateway - Puerto 3100)" -ForegroundColor Cyan
Write-Host "GET  $apiGateway/api/v1/songs/available" -ForegroundColor White
Write-Host "GET  $apiGateway/api/v1/songs/mine (requiere JWT)" -ForegroundColor White
Write-Host "POST $apiGateway/api/v1/songs (requiere JWT)" -ForegroundColor White
Write-Host "GET  $apiGateway/api/v1/songs/:id" -ForegroundColor White
Write-Host "PUT  $apiGateway/api/v1/songs/:id (requiere JWT)" -ForegroundColor White
Write-Host "DELETE $apiGateway/api/v1/songs/:id (requiere JWT)" -ForegroundColor White
Write-Host "POST $apiGateway/api/v1/songs/:id/purchase (requiere JWT)" -ForegroundColor White

Write-Host "`n📜 LICENCIAS (API Gateway - Puerto 3100)" -ForegroundColor Cyan
Write-Host "GET  $apiGateway/api/v1/songs/licenses/purchased (requiere JWT)" -ForegroundColor White
Write-Host "GET  $apiGateway/api/v1/songs/licenses/sold (requiere JWT)" -ForegroundColor White

Write-Host "`n💬 CHAT (API Gateway - Puerto 3000)" -ForegroundColor Cyan
Write-Host "GET  $apiGateway/chat (requiere JWT)" -ForegroundColor White
Write-Host "POST $apiGateway/chat (requiere JWT)" -ForegroundColor White
Write-Host "GET  $apiGateway/chat/:id (requiere JWT)" -ForegroundColor White
Write-Host "GET  $apiGateway/chat/:id/messages (requiere JWT)" -ForegroundColor White
Write-Host "POST $apiGateway/chat/:id/messages (requiere JWT)" -ForegroundColor White

Write-Host "`n🏥 HEALTH CHECKS" -ForegroundColor Cyan
Write-Host "GET  $authService/health" -ForegroundColor White
Write-Host "GET  $songsService/health" -ForegroundColor White
Write-Host "GET  $chatService/health" -ForegroundColor White

Write-Host "`n📚 DOCUMENTACIÓN SWAGGER" -ForegroundColor Magenta
Write-Host "API Gateway:  $apiGateway/api" -ForegroundColor White
Write-Host "Auth Service: $authService/api" -ForegroundColor White
Write-Host "Songs Service: $songsService/api" -ForegroundColor White
Write-Host "Chat Service: $chatService/api" -ForegroundColor White

Write-Host "`n🚀 Iniciando pruebas automáticas..." -ForegroundColor Yellow

# Función para hacer requests seguros
function Invoke-SafeRequest {
    param($Uri, $Method = "GET", $Body = $null, $Headers = @{})
    
    try {
        if ($Body) {
            $response = Invoke-RestMethod -Uri $Uri -Method $Method -Body $Body -ContentType "application/json" -Headers $Headers -TimeoutSec 10
        } else {
            $response = Invoke-RestMethod -Uri $Uri -Method $Method -Headers $Headers -TimeoutSec 10
        }
        return @{ Success = $true; Data = $response }
    }
    catch {
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

# 1. Health Checks
Write-Host "`n1️⃣ Verificando servicios..." -ForegroundColor Yellow

$services = @(
    @{ Name = "Auth Service"; Url = "$authService/health" },
    @{ Name = "Songs Service"; Url = "$songsService/health" },
    @{ Name = "Chat Service"; Url = "$chatService/health" }
)

foreach ($service in $services) {
    $result = Invoke-SafeRequest -Uri $service.Url
    if ($result.Success) {
        Write-Host "✅ $($service.Name): OK" -ForegroundColor Green
    } else {
        Write-Host "❌ $($service.Name): $($result.Error)" -ForegroundColor Red
    }
}

# 2. Probar registro de usuario
Write-Host "`n2️⃣ Probando registro de usuario..." -ForegroundColor Yellow

$registerData = @{
    username = "testuser_$(Get-Random)"
    email = "test$(Get-Random)@example.com"
    password = "password123"
} | ConvertTo-Json

$registerResult = Invoke-SafeRequest -Uri "$apiGateway/api/v1/auth/register" -Method "POST" -Body $registerData

if ($registerResult.Success) {
    Write-Host "✅ Usuario registrado exitosamente" -ForegroundColor Green
    $username = ($registerData | ConvertFrom-Json).username
    $email = ($registerData | ConvertFrom-Json).email
    
    # 3. Probar login
    Write-Host "`n3️⃣ Probando login..." -ForegroundColor Yellow
    
    $loginData = @{
        email = $email
        password = "password123"
    } | ConvertTo-Json
    
    $loginResult = Invoke-SafeRequest -Uri "$apiGateway/api/v1/auth/login" -Method "POST" -Body $loginData
    
    if ($loginResult.Success -and $loginResult.Data.access_token) {
        Write-Host "✅ Login exitoso" -ForegroundColor Green
        $token = $loginResult.Data.access_token
        $headers = @{ Authorization = "Bearer $token" }
        
        # 4. Probar obtener perfil
        Write-Host "`n4️⃣ Probando obtener perfil..." -ForegroundColor Yellow
        $profileResult = Invoke-SafeRequest -Uri "$apiGateway/api/v1/auth/profile" -Headers $headers
        
        if ($profileResult.Success) {
            Write-Host "✅ Perfil obtenido: $($profileResult.Data.username)" -ForegroundColor Green
        } else {
            Write-Host "❌ Error obteniendo perfil: $($profileResult.Error)" -ForegroundColor Red
        }
        
        # 5. Probar obtener canciones disponibles
        Write-Host "`n5️⃣ Probando obtener canciones disponibles..." -ForegroundColor Yellow
        $songsResult = Invoke-SafeRequest -Uri "$apiGateway/api/v1/songs/available"
        
        if ($songsResult.Success) {
            Write-Host "✅ Canciones disponibles: $($songsResult.Data.total)" -ForegroundColor Green
        } else {
            Write-Host "❌ Error obteniendo canciones: $($songsResult.Error)" -ForegroundColor Red
        }
        
        # 6. Probar crear canción
        Write-Host "`n6️⃣ Probando crear canción..." -ForegroundColor Yellow
        $songData = @{
            title = "Canción de Prueba $(Get-Random)"
            name = "Canción de Prueba $(Get-Random)"  
            genre = "rock"
            price = 9.99
            duration = 180
        } | ConvertTo-Json
        
        Write-Host "📝 Datos enviados: $songData" -ForegroundColor Gray
        
        $createSongResult = Invoke-SafeRequest -Uri "$apiGateway/api/v1/songs" -Method "POST" -Body $songData -Headers $headers
        
        if ($createSongResult.Success) {
            Write-Host "✅ Canción creada: $($createSongResult.Data.name)" -ForegroundColor Green
        } else {
            Write-Host "❌ Error creando canción: $($createSongResult.Error)" -ForegroundColor Red
        }
        
    } else {
        Write-Host "❌ Error en login: $($loginResult.Error)" -ForegroundColor Red
    }
    
} else {
    Write-Host "❌ Error en registro: $($registerResult.Error)" -ForegroundColor Red
}

Write-Host "`n🎉 Pruebas completadas!" -ForegroundColor Green
Write-Host "`n💡 Para usar la API:" -ForegroundColor Cyan
Write-Host "1. Haz POST a /api/v1/auth/register para crear una cuenta" -ForegroundColor White
Write-Host "2. Haz POST a /api/v1/auth/login para obtener un token JWT" -ForegroundColor White
Write-Host "3. Incluye el token en el header: Authorization: Bearer <token>" -ForegroundColor White
Write-Host "4. Visita http://localhost:3100/api para ver la documentación completa" -ForegroundColor White
