# Setup script for Sec2All development environment
Write-Host "Setting up Sec2All development environment..." -ForegroundColor Green

# Check Python installation
try {
    $pythonVersion = python --version
    Write-Host "Found Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Python not found. Please install Python 3.8 or later" -ForegroundColor Red
    exit 1
}

# Check Node.js installation
try {
    $nodeVersion = node --version
    Write-Host "Found Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found. Please install Node.js 14 or later" -ForegroundColor Red
    exit 1
}

# Create Python virtual environment
Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
python -m venv backend/venv

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& backend/venv/Scripts/Activate.ps1

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r backend/requirements.txt

# Install Node.js dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
npm install

# Create necessary directories
Write-Host "Creating necessary directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path backend/uploads/clients
New-Item -ItemType Directory -Force -Path backend/logs

# Create .env file if it doesn't exist
if (-not (Test-Path backend/.env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item backend/.env.example backend/.env -ErrorAction SilentlyContinue
    Write-Host "Please update the .env file with your configuration" -ForegroundColor Yellow
}

Write-Host "`nSetup completed!" -ForegroundColor Green
Write-Host "`nTo start the development servers:"
Write-Host "1. Backend: cd backend; uvicorn main:app --reload --port 5174" -ForegroundColor Cyan
Write-Host "2. Frontend: npm run dev" -ForegroundColor Cyan

Write-Host "`nMake sure to:"
Write-Host "1. Update backend/.env with your SSH configuration" -ForegroundColor Yellow
Write-Host "2. Set up your SSH keys for the signing server" -ForegroundColor Yellow
Write-Host "3. Configure the signing server with proper directory structure" -ForegroundColor Yellow
