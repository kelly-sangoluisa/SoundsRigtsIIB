# Script para probar compra de canciones y licencias

Write-Host "Probando Compra de Canciones y Licencias" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# URLs base
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

Write-Host "1. Obteniendo canciones disponibles..." -ForegroundColor Yellow
$songsResult = Invoke-SafeRequest -Uri "$songsService/songs/available"

if ($songsResult.Success -and $songsResult.Data.songs.Length -gt 0) {
    Write-Host "Canciones disponibles: $($songsResult.Data.total)" -ForegroundColor Green
    
    # Seleccionar una canción para comprar (que no sea del usuario que va a comprar)
    $songToBuy = $songsResult.Data.songs | Where-Object { $_.artistId -ne 6 } | Select-Object -First 1
    
    if ($songToBuy) {
        Write-Host "Canción seleccionada para comprar:" -ForegroundColor Cyan
        Write-Host "  ID: $($songToBuy.id)" -ForegroundColor Gray
        Write-Host "  Título: $($songToBuy.name)" -ForegroundColor Gray
        Write-Host "  Artista ID: $($songToBuy.artistId)" -ForegroundColor Gray
        Write-Host "  Precio: $($songToBuy.price)" -ForegroundColor Gray
        
        Write-Host "2. Realizando compra..." -ForegroundColor Yellow
        $purchaseData = @{
            buyerId = 6  # Usuario que va a comprar
            buyerMessage = "Me gusta esta canción, quiero comprarla!"
            offerPrice = $songToBuy.price
        } | ConvertTo-Json
        
        Write-Host "Datos de compra: $purchaseData" -ForegroundColor Gray
        
        $purchaseResult = Invoke-SafeRequest -Uri "$songsService/songs/$($songToBuy.id)/purchase" -Method "POST" -Body $purchaseData
        
        if ($purchaseResult.Success) {
            Write-Host "¡Compra exitosa!" -ForegroundColor Green
            Write-Host "Licencia ID: $($purchaseResult.Data.licenseId)" -ForegroundColor Green
            Write-Host "Mensaje: $($purchaseResult.Data.message)" -ForegroundColor Green
            Write-Host "Estado: $($purchaseResult.Data.status)" -ForegroundColor Green
            
            Write-Host "3. Verificando licencias compradas..." -ForegroundColor Yellow
            $licensesResult = Invoke-SafeRequest -Uri "$songsService/licenses/purchased?userId=6"
            
            if ($licensesResult.Success) {
                Write-Host "Licencias compradas: $($licensesResult.Data.licenses.Length)" -ForegroundColor Green
                $licensesResult.Data.licenses | ForEach-Object {
                    Write-Host "  - $($_.songTitle) por $($_.artistName) - $($_.price)€" -ForegroundColor Gray
                }
            } else {
                Write-Host "Error obteniendo licencias compradas: $($licensesResult.Error)" -ForegroundColor Red
            }
            
            Write-Host "4. Verificando licencias vendidas (artista)..." -ForegroundColor Yellow
            $soldLicensesResult = Invoke-SafeRequest -Uri "$songsService/licenses/sold?userId=$($songToBuy.artistId)"
            
            if ($soldLicensesResult.Success) {
                Write-Host "Licencias vendidas por artista $($songToBuy.artistId): $($soldLicensesResult.Data.licenses.Length)" -ForegroundColor Green
                $soldLicensesResult.Data.licenses | ForEach-Object {
                    Write-Host "  - $($_.songTitle) vendida a $($_.buyerName) - $($_.price)€" -ForegroundColor Gray
                }
            } else {
                Write-Host "Error obteniendo licencias vendidas: $($soldLicensesResult.Error)" -ForegroundColor Red
            }
            
        } else {
            Write-Host "Error en compra: $($purchaseResult.Error)" -ForegroundColor Red
        }
        
    } else {
        Write-Host "No hay canciones disponibles para comprar (todas son del mismo usuario)" -ForegroundColor Yellow
    }
} else {
    Write-Host "Error obteniendo canciones: $($songsResult.Error)" -ForegroundColor Red
}

Write-Host "Pruebas de compra completadas!" -ForegroundColor Green
