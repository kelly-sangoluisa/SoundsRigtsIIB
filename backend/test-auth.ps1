# Test auth service
Write-Host "Testing Auth Service..."

# Test health check
Write-Host "`n1. Health Check:"
try {
    $health = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method GET
    Write-Host "Status: $($health.StatusCode)"
    Write-Host "Response: $($health.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# Test registration
Write-Host "`n2. User Registration:"
try {
    $body = @{
        username = "newuser" + (Get-Date).Ticks
        email = "test" + (Get-Date).Ticks + "@example.com"
        password = "password123"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "http://localhost:3001/auth/register" -Method POST -ContentType "application/json" -Body $body
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error Response: $responseBody"
    }
}

Write-Host "`nTest completed."
