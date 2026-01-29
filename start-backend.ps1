# Script para iniciar el backend de Smartfin
Write-Host "🚀 Iniciando Backend de Smartfin..." -ForegroundColor Cyan

# Navegar al directorio del backend
Set-Location "c:\Users\nayen\Desktop\backend-finanzas-chatbot"

# Verificar que existe package.json
if (-Not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json en el directorio del backend" -ForegroundColor Red
    exit 1
}

# Iniciar el servidor en modo desarrollo
Write-Host "📦 Ejecutando npm run dev..." -ForegroundColor Green
npm run dev
