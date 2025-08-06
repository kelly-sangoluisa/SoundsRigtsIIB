# Script simple para probar CRUD de canciones

Write-Host "Probando Backend SoundsRights" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green

# URLs base
$apiGateway = "http://localhost:3100"
$songsService = "http://localhost:3002"

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

Write-Host "1. Probando registro de usuario..." -ForegroundColor Yellow

$registerData = @{
    username = "testuser_$(Get-Random)"
    email = "test$(Get-Random)@example.com"
    password = "password123"
} | ConvertTo-Json

$registerResult = Invoke-SafeRequest -Uri "$apiGateway/api/v1/auth/register" -Method "POST" -Body $registerData

if ($registerResult.Success) {
    Write-Host "Usuario registrado exitosamente" -ForegroundColor Green
    $username = ($registerData | ConvertFrom-Json).username
    $email = ($registerData | ConvertFrom-Json).email
    
    Write-Host "2. Probando login..." -ForegroundColor Yellow
    
    $loginData = @{
        email = $email
        password = "password123"
    } | ConvertTo-Json
    
    $loginResult = Invoke-SafeRequest -Uri "$apiGateway/api/v1/auth/login" -Method "POST" -Body $loginData
    
    if ($loginResult.Success -and $loginResult.Data.access_token) {
        Write-Host "Login exitoso" -ForegroundColor Green
        $token = $loginResult.Data.access_token
        $headers = @{ Authorization = "Bearer $token" }
        
        Write-Host "3. Probando obtener canciones disponibles..." -ForegroundColor Yellow
        $songsResult = Invoke-SafeRequest -Uri "$songsService/songs/available"
        
        if ($songsResult.Success) {
            Write-Host "Canciones disponibles: $($songsResult.Data.total)" -ForegroundColor Green
        } else {
            Write-Host "Error obteniendo canciones: $($songsResult.Error)" -ForegroundColor Red
        }
        
        Write-Host "4. Probando crear cancion..." -ForegroundColor Yellow
        $songData = @{
            title = "Cancion de Prueba $(Get-Random)"
            genre = "rock"
            price = 9.99
            duration = 180
            artistId = $loginResult.Data.user.id
        } | ConvertTo-Json
        
        Write-Host "Datos enviados: $songData" -ForegroundColor Gray
        
        $createSongResult = Invoke-SafeRequest -Uri "$songsService/songs" -Method "POST" -Body $songData
        
        if ($createSongResult.Success) {
            Write-Host "Cancion creada: $($createSongResult.Data.name)" -ForegroundColor Green
            $songId = $createSongResult.Data.id
            Write-Host "ID de la cancion creada: $songId" -ForegroundColor Gray
            
            Write-Host "5. Probando obtener mis canciones..." -ForegroundColor Yellow
            $mySongsResult = Invoke-SafeRequest -Uri "$songsService/songs/mine?userId=$($loginResult.Data.user.id)"
            
            if ($mySongsResult.Success) {
                Write-Host "Mis canciones: $($mySongsResult.Data.total)" -ForegroundColor Green
            } else {
                Write-Host "Error obteniendo mis canciones: $($mySongsResult.Error)" -ForegroundColor Red
            }
            
            Write-Host "6. Probando actualizar cancion..." -ForegroundColor Yellow
            $updateData = @{
                title = "Cancion Actualizada"
                price = 12.99
                artistId = $loginResult.Data.user.id
            } | ConvertTo-Json
            
            $updateResult = Invoke-SafeRequest -Uri "$songsService/songs/$songId" -Method "PUT" -Body $updateData -Headers $headers
            
            if ($updateResult.Success) {
                Write-Host "Cancion actualizada exitosamente" -ForegroundColor Green
            } else {
                Write-Host "Error actualizando cancion: $($updateResult.Error)" -ForegroundColor Red
            }
            
            Write-Host "7. Probando eliminar cancion..." -ForegroundColor Yellow
            $deleteUrl = "$songsService/songs/$songId" + "?userId=" + $loginResult.Data.user.id
            Write-Host "URL DELETE: $deleteUrl" -ForegroundColor Gray
            $deleteResult = Invoke-SafeRequest -Uri $deleteUrl -Method "DELETE" -Headers $headers
            
            if ($deleteResult.Success) {
                Write-Host "Cancion eliminada exitosamente" -ForegroundColor Green
            } else {
                Write-Host "Error eliminando cancion: $($deleteResult.Error)" -ForegroundColor Red
            }
            
        } else {
            Write-Host "Error creando cancion: $($createSongResult.Error)" -ForegroundColor Red
        }
        
    } else {
        Write-Host "Error en login: $($loginResult.Error)" -ForegroundColor Red
    }
    
} else {
    Write-Host "Error en registro: $($registerResult.Error)" -ForegroundColor Red
}

Write-Host "Pruebas completadas!" -ForegroundColor Green
