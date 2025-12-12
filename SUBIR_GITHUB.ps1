# Script para subir el proyecto a GitHub
# Ejecuta este script en PowerShell desde la raíz del proyecto

Write-Host "=== Subiendo proyecto a GitHub ===" -ForegroundColor Green

# Verificar si git está instalado
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Git no está instalado. Por favor instálalo primero." -ForegroundColor Red
    exit 1
}

# Verificar si ya existe un repositorio git
if (Test-Path .git) {
    Write-Host "Repositorio Git ya existe. Agregando cambios..." -ForegroundColor Yellow
    git add .
    git commit -m "Initial commit: Proyecto completo de tienda online"
} else {
    Write-Host "Inicializando repositorio Git..." -ForegroundColor Cyan
    git init
    git add .
    git commit -m "Initial commit: Proyecto completo de tienda online"
}

# Configurar el repositorio remoto
Write-Host "Configurando repositorio remoto..." -ForegroundColor Cyan
git remote remove origin 2>$null
git remote add origin https://github.com/unmundodecolormeceria/tienda-online.git

# Verificar la rama actual
$currentBranch = git branch --show-current
if (-not $currentBranch) {
    git branch -M main
    $currentBranch = "main"
}

Write-Host "Rama actual: $currentBranch" -ForegroundColor Cyan

# Subir a GitHub
Write-Host "Subiendo código a GitHub..." -ForegroundColor Cyan
Write-Host "NOTA: Si te pide credenciales, usa un Personal Access Token de GitHub" -ForegroundColor Yellow

try {
    git push -u origin $currentBranch
    Write-Host "`n=== ¡Código subido exitosamente a GitHub! ===" -ForegroundColor Green
    Write-Host "Repositorio: https://github.com/unmundodecolormeceria/tienda-online" -ForegroundColor Cyan
} catch {
    Write-Host "`nError al subir. Posibles causas:" -ForegroundColor Red
    Write-Host "1. No tienes permisos en el repositorio" -ForegroundColor Yellow
    Write-Host "2. Necesitas autenticarte con GitHub" -ForegroundColor Yellow
    Write-Host "3. El repositorio remoto no existe o tiene otro nombre" -ForegroundColor Yellow
    Write-Host "`nIntenta ejecutar manualmente:" -ForegroundColor Cyan
    Write-Host "git push -u origin main" -ForegroundColor White
}

Write-Host "`nPresiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

