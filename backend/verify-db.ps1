# Verificar datos en PostgreSQL
Write-Host "Verificando datos en PostgreSQL..."

# Crear archivo SQL temporal para consulta
$sqlQuery = "SELECT id, username, email, created_at FROM users ORDER BY created_at DESC LIMIT 5;"
$sqlQuery | Out-File -FilePath "temp_query.sql" -Encoding utf8

# Ejecutar consulta en PostgreSQL
Write-Host "`nEjecutando consulta en PostgreSQL..."
try {
    $result = docker exec soundsrights-postgres psql -U postgres -d soundsrights -f /temp_query.sql 2>&1
    Write-Host "Resultado:"
    Write-Host $result
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# También intentar una consulta simple
Write-Host "`nContando usuarios totales..."
try {
    $countResult = docker exec soundsrights-postgres psql -U postgres -d soundsrights -c "SELECT COUNT(*) as total_users FROM users;" 2>&1
    Write-Host "Resultado del conteo:"
    Write-Host $countResult
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# Limpiar archivo temporal
if (Test-Path "temp_query.sql") {
    Remove-Item "temp_query.sql"
}

Write-Host "`nVerificación completada."
