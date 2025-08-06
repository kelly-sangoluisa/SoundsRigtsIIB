# Test de conexión simple
Write-Host "Testing backend connection..."

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method GET -UseBasicParsing
    Write-Host "Health check successful!"
    Write-Host "Response: $($response.Content)"
    
    # Test login
    Write-Host "`nTesting login..."
    $body = '{"email":"demo@soundsrights.com","password":"demo123"}'
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3001/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "Login successful!"
    Write-Host "Login response: $($loginResponse.Content)"
    
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

Write-Host "`nTest completed."
