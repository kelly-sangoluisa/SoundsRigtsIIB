# Test profile endpoint with authentication
Write-Host "Testing Profile Endpoint..."

try {
    # First login to get a token
    $loginBody = @{
        email = "demo@soundsrights.com"
        password = "demo123"
    } | ConvertTo-Json

    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3001/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.access_token
    
    Write-Host "Token obtenido: $token"
    
    # Now use the token to get profile
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $profileResponse = Invoke-WebRequest -Uri "http://localhost:3001/auth/profile" -Method GET -Headers $headers
    Write-Host "Profile Status: $($profileResponse.StatusCode)"
    Write-Host "Profile Response: $($profileResponse.Content)"
    
} catch {
    Write-Host "Profile Error: $($_.Exception.Message)"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error Response: $responseBody"
    }
}

Write-Host "`nProfile test completed."
