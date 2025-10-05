# Production Keystore Setup Guide

## Why This Is Important

Banking apps detect debug-signed applications as security risks. To prevent "suspicious application detected" warnings, you must sign your production APK with a proper release keystore.

## Step 1: Generate a Release Keystore

Open a terminal and run the following command:

### Windows (PowerShell/CMD):
```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### macOS/Linux:
```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

You will be prompted to enter:
- **Keystore password**: Choose a strong password (remember this!)
- **Key password**: Choose a strong password (can be same as keystore password)
- **First and last name**: Your name or company name
- **Organizational unit**: Your department (or just press Enter)
- **Organization**: Your company name
- **City/Locality**: Your city
- **State/Province**: Your state
- **Country code**: Two-letter country code (e.g., US, IN, UK)

⚠️ **IMPORTANT**: 
- Keep the `release.keystore` file and passwords **extremely secure**
- If you lose this keystore, you **cannot update your app** on the Play Store
- Backup this file securely (use encrypted cloud storage or password manager)

## Step 2: Configure Gradle Properties

1. Open `android/gradle.properties`
2. Find the commented section at the bottom:
   ```properties
   #MYAPP_RELEASE_STORE_FILE=release.keystore
   #MYAPP_RELEASE_KEY_ALIAS=my-key-alias
   #MYAPP_RELEASE_STORE_PASSWORD=your-store-password
   #MYAPP_RELEASE_KEY_PASSWORD=your-key-password
   ```

3. Uncomment and fill in your actual values:
   ```properties
   MYAPP_RELEASE_STORE_FILE=release.keystore
   MYAPP_RELEASE_KEY_ALIAS=my-key-alias
   MYAPP_RELEASE_STORE_PASSWORD=your-actual-store-password
   MYAPP_RELEASE_KEY_PASSWORD=your-actual-key-password
   ```

## Step 3: Secure Your Credentials

### Option A: Use gradle.properties (Local Development)
Keep the credentials in `android/gradle.properties` but ensure this file is in `.gitignore`

### Option B: Use Environment Variables (Recommended for CI/CD)
Instead of storing in gradle.properties, you can use environment variables:

1. Remove or keep commented the credentials in gradle.properties
2. Set environment variables:
   ```bash
   # Windows (PowerShell)
   $env:MYAPP_RELEASE_STORE_FILE="release.keystore"
   $env:MYAPP_RELEASE_KEY_ALIAS="my-key-alias"
   $env:MYAPP_RELEASE_STORE_PASSWORD="your-password"
   $env:MYAPP_RELEASE_KEY_PASSWORD="your-password"

   # macOS/Linux
   export MYAPP_RELEASE_STORE_FILE=release.keystore
   export MYAPP_RELEASE_KEY_ALIAS=my-key-alias
   export MYAPP_RELEASE_STORE_PASSWORD=your-password
   export MYAPP_RELEASE_KEY_PASSWORD=your-password
   ```

## Step 4: Add Keystore to .gitignore

Ensure your keystore is **never** committed to version control:

Add to `.gitignore` (if not already present):
```
# Android Keystores
*.keystore
*.jks

# Gradle sensitive files
android/gradle.properties
```

## Step 5: Build Release APK

### Using EAS Build (Recommended):
```bash
eas build --platform android --profile production
```

Configure credentials in EAS:
```bash
eas credentials
```

### Using Local Build:
```bash
cd android
./gradlew assembleRelease
```

The signed APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## Step 6: Verify the APK is Properly Signed

Check the signature:
```bash
jarsigner -verify -verbose -certs android/app/build/outputs/apk/release/app-release.apk
```

You should see: `jar verified.`

## Additional Security Measures

The following security improvements have been implemented:

1. ✅ **Debuggable flag disabled** for release builds
2. ✅ **Network security configuration** - only allows HTTPS connections
3. ✅ **Backup disabled** - prevents backup of sensitive data
4. ✅ **Cleartext traffic disabled** - prevents unencrypted network traffic
5. ✅ **Proper signing configuration** - uses production keystore

## Testing with Banking Apps

After installing the properly signed release APK:
1. Uninstall any previous debug versions of your app
2. Install the new release APK: `adb install -r android/app/build/outputs/apk/release/app-release.apk`
3. Open your banking application
4. The "suspicious application detected" warning should no longer appear

## Troubleshooting

### Issue: "Cannot find release.keystore"
- Ensure the keystore file is in `android/app/` directory
- Check the path in gradle.properties is correct

### Issue: "Invalid keystore format"
- Ensure you used PKCS12 format when generating
- Try regenerating the keystore

### Issue: Still getting security warnings
- Make sure you're installing the **release** APK, not debug
- Try clearing app data of your banking app
- Restart your device after installing the release APK
- Ensure ProGuard is enabled for additional code obfuscation

### Issue: "Keystore was tampered with, or password was incorrect"
- Double-check your passwords in gradle.properties
- Ensure there are no extra spaces or special characters

## EAS Build Configuration

If using EAS Build, add to `eas.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    }
  }
}
```

## Important Notes

- **Never** share your keystore passwords
- **Never** commit your keystore to Git
- **Always** keep a secure backup of your keystore
- **Use** the same keystore for all updates to your app
- **Consider** using Google Play App Signing for additional security

---

For more information, see:
- [Android Signing Documentation](https://developer.android.com/studio/publish/app-signing)
- [Expo App Signing Guide](https://docs.expo.dev/app-signing/app-credentials/)

