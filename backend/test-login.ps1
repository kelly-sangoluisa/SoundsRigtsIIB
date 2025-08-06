# Test login with the user we just created
Write-Host "Testing Login..."

try {
    # First let's get the latest user credentials by testing registration again to see the email used
    Write-Host "Testing login with known credentials..."
    
    $loginBody = @{
        email = "demo@soundsrights.com"  # User from init.sql
        password = "demo123"
    } | ConvertTo-Json

    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3001/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "Login Status: $($loginResponse.StatusCode)"
    Write-Host "Login Response: $($loginResponse.Content)"
    
} catch {
    Write-Host "Login Error: $($_.Exception.Message)"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error Response: $responseBody"
    }
}

Write-Host "`nLogin test completed."
