# Local Android Build Guide

This guide will help you build and sign your Expo/React Native Android app locally, following the [official React Native documentation](https://reactnative.dev/docs/signed-apk-android).

## Prerequisites

1. **Java JDK** installed (required for `keytool` and Gradle)
   - Check if installed: `java -version`
   - On Windows, `keytool` is typically at: `C:\Program Files\Java\jdkx.x.x_x\bin\keytool.exe`
   - On macOS/Linux, find JDK: `/usr/libexec/java_home` (macOS)

2. **Android SDK** and build tools installed
3. **Node.js** and npm/pnpm installed
4. **Expo CLI** installed globally (optional but recommended)

## Step 1: Generate a Release Keystore

You need to generate a signing key for your app. This key will be used to sign all release builds.

### Windows

Open PowerShell or Command Prompt **as Administrator** and navigate to the `android/app` directory:

```powershell
cd android\app
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

If `keytool` is not in your PATH, use the full path:
```powershell
"C:\Program Files\Java\jdk-XX\bin\keytool.exe" -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### macOS/Linux

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**You will be prompted to enter:**
- **Keystore password**: Choose a strong password (remember this!)
- **Key password**: Choose a strong password (can be same as keystore password)
- **First and last name**: Your name or company name
- **Organizational unit**: Your department (or just press Enter)
- **Organization**: Your company name
- **City/Locality**: Your city
- **State/Province**: Your state
- **Country code**: Two-letter country code (e.g., US, IN, UK)

⚠️ **IMPORTANT**: 
- **Keep the keystore file and passwords secure**
- **Backup this file** - if you lose it, you cannot update your app on the Play Store
- The keystore file should be in `android/app/` directory

## Step 2: Configure Gradle Variables

You have two options for storing your signing credentials:

### Option A: Use `android/gradle.properties` (Local Development)

1. Open `android/gradle.properties`
2. Uncomment and fill in the signing configuration:

```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=your-actual-store-password
MYAPP_UPLOAD_KEY_PASSWORD=your-actual-key-password
```

**Note**: This file is already configured to be ignored by git (via `.gitignore`), but double-check to ensure your credentials are not committed.

### Option B: Use `~/.gradle/gradle.properties` (Recommended for Security)

This keeps credentials out of your project directory entirely.

**Windows:**
```powershell
# Create or edit: C:\Users\YourUsername\.gradle\gradle.properties
```

**macOS/Linux:**
```bash
# Create or edit: ~/.gradle/gradle.properties
```

Add the same properties as Option A.

## Step 3: Verify Build Configuration

The `android/app/build.gradle` file has been configured with the release signing config. It will:
- Use the release keystore if `MYAPP_UPLOAD_STORE_FILE` is defined
- Fall back to debug signing if not configured (for development)

## Step 4: Build the Release APK

### Using Gradle directly (Recommended for local builds)

Navigate to the `android` directory and run:

**Windows:**
```powershell
cd android
.\gradlew assembleRelease
```

**macOS/Linux:**
```bash
cd android
./gradlew assembleRelease
```

The signed APK will be generated at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Using React Native CLI

From the project root:

```bash
npx react-native build-android --mode=release
```

### Using Expo (if using Expo dev client)

```bash
npx expo run:android --variant release
```

## Step 5: Build Android App Bundle (AAB) for Google Play

If you plan to upload to Google Play Store, build an AAB instead:

**Windows:**
```powershell
cd android
.\gradlew bundleRelease
```

**macOS/Linux:**
```bash
cd android
./gradlew bundleRelease
```

The AAB will be at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

## Step 6: Verify the APK is Properly Signed

Check the signature to ensure it's not using the debug keystore:

**Windows:**
```powershell
jarsigner -verify -verbose -certs android\app\build\outputs\apk\release\app-release.apk
```

**macOS/Linux:**
```bash
jarsigner -verify -verbose -certs android/app/build/outputs/apk/release/app-release.apk
```

You should see: `jar verified.`

## Step 7: Install and Test on Device

1. **Uninstall any previous version** of the app from your device
2. **Install the release APK:**

```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

Or manually transfer the APK to your device and install it.

3. **Test thoroughly** - Release builds bundle all JavaScript, so you don't need Metro bundler running.

## Troubleshooting

### Issue: "Cannot find keytool"
- **Windows**: Use the full path to keytool or add Java bin directory to PATH
- **macOS/Linux**: Install JDK or use `sudo` if needed

### Issue: "Cannot find release.keystore"
- Ensure the keystore file is in `android/app/` directory
- Check the filename in `gradle.properties` matches exactly (case-sensitive)

### Issue: "Keystore was tampered with, or password was incorrect"
- Double-check passwords in `gradle.properties`
- Ensure there are no extra spaces or special characters
- Try regenerating the keystore if needed

### Issue: "Build failed" or "Gradle sync failed"
- Clean the build: `cd android && ./gradlew clean`
- Delete `android/.gradle` and `android/app/build` directories
- Try building again

### Issue: Still using debug signing
- Verify `MYAPP_UPLOAD_STORE_FILE` is set in `gradle.properties`
- Check that the keystore file exists in `android/app/`
- Clean and rebuild: `cd android && ./gradlew clean assembleRelease`

### Issue: "Execution failed for task ':app:bundleReleaseJsAndAssets'"
- Make sure you're in the project root when running Gradle
- Ensure Node.js is installed and in PATH
- Try: `cd android && ./gradlew clean` then rebuild

## Security Best Practices

1. ✅ **Never commit keystore files** to version control
2. ✅ **Never commit passwords** in `gradle.properties` (use `~/.gradle/gradle.properties` instead)
3. ✅ **Backup your keystore** securely (encrypted cloud storage or password manager)
4. ✅ **Use the same keystore** for all updates to your app
5. ✅ **Keep keystore passwords** in a secure password manager

## File Structure

After setup, your project should have:

```
PrashantGamatex/
├── android/
│   ├── app/
│   │   ├── my-upload-key.keystore  ← Your signing key (NOT in git)
│   │   └── build.gradle             ← Already configured
│   └── gradle.properties            ← Add your credentials here
└── .gitignore                       ← Already excludes *.keystore
```

## Next Steps

- **For Google Play**: Upload the AAB file to Google Play Console
- **For Internal Testing**: Share the APK with testers
- **For Production**: Ensure ProGuard is enabled for code obfuscation (optional)

## Additional Resources

- [React Native - Publishing to Google Play Store](https://reactnative.dev/docs/signed-apk-android)
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)
- [Expo - Deploying to App Stores](https://docs.expo.dev/distribution/app-stores/)

---

**Last Updated**: Following React Native official documentation for Android app signing.

