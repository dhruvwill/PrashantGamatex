# PowerShell script to build Android release APK
# This script will prompt for keystore password and build the release APK

param(
    [Parameter(Mandatory=$false)]
    [string]$KeystorePassword,
    
    [Parameter(Mandatory=$false)]
    [string]$KeyPassword
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Android Release APK Builder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if keystore exists
$keystorePath = "app\my-upload-key.keystore"
if (-not (Test-Path $keystorePath)) {
    Write-Host "Error: Keystore not found at $keystorePath" -ForegroundColor Red
    Write-Host "Please generate the keystore first." -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Keystore found: $keystorePath" -ForegroundColor Green
Write-Host ""

# Prompt for passwords if not provided
if ([string]::IsNullOrEmpty($KeystorePassword)) {
    $securePassword = Read-Host "Enter keystore password" -AsSecureString
    $KeystorePassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))
}

if ([string]::IsNullOrEmpty($KeyPassword)) {
    $secureKeyPassword = Read-Host "Enter key password (or press Enter to use same as keystore)" -AsSecureString
    if ($secureKeyPassword.Length -gt 0) {
        $KeyPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKeyPassword))
    } else {
        $KeyPassword = $KeystorePassword
    }
}

# Set environment variables
$env:MYAPP_UPLOAD_STORE_FILE = "my-upload-key.keystore"
$env:MYAPP_UPLOAD_KEY_ALIAS = "my-key-alias"
$env:MYAPP_UPLOAD_STORE_PASSWORD = $KeystorePassword
$env:MYAPP_UPLOAD_KEY_PASSWORD = $KeyPassword

Write-Host ""
Write-Host "Environment variables set." -ForegroundColor Green
Write-Host "Building release APK..." -ForegroundColor Yellow
Write-Host ""

# Update gradle.properties temporarily (we'll use env vars, but gradle.properties needs to be updated too)
# Actually, let's update gradle.properties with the password
$gradlePropsPath = "gradle.properties"
$content = Get-Content $gradlePropsPath -Raw
$content = $content -replace 'MYAPP_UPLOAD_STORE_PASSWORD=.*', "MYAPP_UPLOAD_STORE_PASSWORD=$KeystorePassword"
$content = $content -replace 'MYAPP_UPLOAD_KEY_PASSWORD=.*', "MYAPP_UPLOAD_KEY_PASSWORD=$KeyPassword"
$content = $content -replace 'MYAPP_UPLOAD_STORE_PASSWORD=YOUR_KEYSTORE_PASSWORD_HERE', "MYAPP_UPLOAD_STORE_PASSWORD=$KeystorePassword"
$content = $content -replace 'MYAPP_UPLOAD_KEY_PASSWORD=YOUR_KEY_PASSWORD_HERE', "MYAPP_UPLOAD_KEY_PASSWORD=$KeyPassword"
Set-Content -Path $gradlePropsPath -Value $content -NoNewline

# Build the release APK
Write-Host "Running: .\gradlew assembleRelease" -ForegroundColor Cyan
Write-Host ""

& .\gradlew assembleRelease

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Build successful!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    $apkPath = "app\build\outputs\apk\release\app-release.apk"
    if (Test-Path $apkPath) {
        $apkSize = (Get-Item $apkPath).Length / 1MB
        Write-Host "APK Location: $apkPath" -ForegroundColor Cyan
        Write-Host "APK Size: $([math]::Round($apkSize, 2)) MB" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "To install on device:" -ForegroundColor Yellow
        Write-Host "  adb install -r $apkPath" -ForegroundColor White
    }
} else {
    Write-Host ""
    Write-Host "Build failed. Check the error messages above." -ForegroundColor Red
    exit 1
}

