# PowerShell script to generate Android release keystore
# Run this script in the android/app directory

$keytoolPath = "C:\Program Files\Java\jdk-17\bin\keytool.exe"

if (-not (Test-Path $keytoolPath)) {
    Write-Host "Error: keytool not found at $keytoolPath" -ForegroundColor Red
    Write-Host "Please update the keytoolPath variable in this script with the correct path." -ForegroundColor Yellow
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Android Release Keystore Generator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You will be prompted to enter:" -ForegroundColor Yellow
Write-Host "  1. Keystore password (at least 6 characters)" -ForegroundColor Yellow
Write-Host "  2. Key password (can be same as keystore password)" -ForegroundColor Yellow
Write-Host "  3. Certificate information (name, organization, etc.)" -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT: Remember these passwords! You'll need them to sign your app." -ForegroundColor Red
Write-Host ""
Write-Host "Press Enter to continue..." -ForegroundColor Green
Read-Host

& "$keytoolPath" -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Keystore generated successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Update android/gradle.properties with your keystore credentials" -ForegroundColor White
    Write-Host "2. Run: cd ..\.. && cd android && .\gradlew assembleRelease" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Error generating keystore. Please try again." -ForegroundColor Red
}

