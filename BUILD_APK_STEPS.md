# Step-by-Step: Generate Keystore and Build Android APK

## ✅ Step 1: Generate Release Keystore

**Open PowerShell** (navigate to the android/app directory first) and run:

```powershell
cd D:\Projects\PrashantGroup\PrashantGamatex\android\app
& "C:\Program Files\Java\jdk-17\bin\keytool.exe" -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**Note:** Use `&` before the quoted path in PowerShell to execute the command properly.

**Enter the following when prompted:**
- **Keystore password**: (at least 6 characters) - ⚠️ **SAVE THIS PASSWORD!**
- **Re-enter password**: (same password)
- **Key password**: (Press Enter to use same, or enter different)
- **First and last name**: Prashant Group (or your name)
- **Organizational unit**: (Press Enter)
- **Organization**: Prashant Group (or your company)
- **City**: (Your city)
- **State**: (Your state)
- **Country code**: IN (or your country code)

**Verify it was created:**
```powershell
ls my-upload-key.keystore
```

---

## ✅ Step 2: Configure Gradle Properties

1. Open `android/gradle.properties` in your editor
2. Find the section at the bottom (lines 61-67)
3. Uncomment and fill in your actual values:

```properties
# Release signing configuration
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=your-actual-keystore-password
MYAPP_UPLOAD_KEY_PASSWORD=your-actual-key-password
```

**Replace:**
- `your-actual-keystore-password` with the password you entered in Step 1
- `your-actual-key-password` with the key password (same if you pressed Enter)

---

## ✅ Step 3: Build the Release APK

From the project root, run:

```powershell
cd D:\Projects\PrashantGroup\PrashantGamatex\android
.\gradlew assembleRelease
```

**This will:**
- Bundle your JavaScript code
- Compile native code
- Sign the APK with your release keystore
- Generate: `android/app/build/outputs/apk/release/app-release.apk`

**Build time:** Usually 2-5 minutes on first build

---

## ✅ Step 4: Verify the APK

Check that the APK was created and is properly signed:

```powershell
# Check file exists
ls android\app\build\outputs\apk\release\app-release.apk

# Verify signature
jarsigner -verify -verbose -certs android\app\build\outputs\apk\release\app-release.apk
```

You should see: `jar verified.`

---

## ✅ Step 5: Install on Device

**Option A: Using ADB (if device connected)**
```powershell
adb install -r android\app\build\outputs\apk\release\app-release.apk
```

**Option B: Manual Install**
1. Copy `android/app/build/outputs/apk/release/app-release.apk` to your Android device
2. Open the file on your device
3. Allow installation from unknown sources if prompted
4. Install the app

---

## 🔧 Troubleshooting

### "Cannot find keytool"
- Make sure Java JDK is installed
- Try: `java -version` to verify
- Update the path in the command if your JDK is in a different location

### "Keystore password was incorrect"
- Double-check passwords in `gradle.properties`
- Make sure there are no extra spaces
- Passwords are case-sensitive

### "Build failed" or "Gradle sync failed"
```powershell
cd android
.\gradlew clean
.\gradlew assembleRelease
```

### "Execution failed for task ':app:bundleReleaseJsAndAssets'"
- Make sure you're in the `android` directory when running gradlew
- Ensure Node.js is installed and in PATH

---

## 📝 Quick Reference

**Keystore location:** `android/app/my-upload-key.keystore`  
**APK output:** `android/app/build/outputs/apk/release/app-release.apk`  
**Gradle properties:** `android/gradle.properties`

---

**After completing these steps, your signed release APK will be ready!**

