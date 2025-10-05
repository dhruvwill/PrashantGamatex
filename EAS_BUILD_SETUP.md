# EAS Build Configuration Guide

This document explains the EAS build configuration and fixes for common issues.

## ✅ Configured Fixes

### 1. **Dependency Resolution Fix**
- **Issue**: `victory-native` peer dependency conflict with `@shopify/react-native-skia`
- **Solution**: Added `.npmrc` with `legacy-peer-deps=true` and `package-lock=false`
- **File**: `.npmrc`

### 2. **Native Binary Platform Mismatch Fix**
- **Issue**: `lightningcss` (used by NativeWind) installing Windows binaries instead of Linux binaries on EAS
- **Solutions Applied**:
  1. Removed `package-lock.json` (via `package-lock=false` in `.npmrc`)
  2. Added `lightningcss` as explicit dependency
  3. Created EAS build hooks to verify/reinstall Linux binaries
- **Files**: 
  - `.npmrc`
  - `package.json` (added `lightningcss`)
  - `eas-build-pre-install.sh` (cleans old installations)
  - `eas-build-post-install.sh` (verifies Linux binary)
  - `eas.json` (configured hooks)

### 3. **Upload Size Optimization**
- **Issue**: 676 MB upload size
- **Solution**: Updated `.easignore` to exclude build artifacts
- **Result**: Reduced to ~48 MB
- **File**: `.easignore`

### 4. **Package Management**
- **Issue**: Expo warning about direct installation of `@expo/config-plugins` and `@expo/metro-config`
- **Solution**: Removed these from `package.json` (now imported from `expo` package)
- **File**: `package.json`

## 📋 Build Configuration

### Current EAS Configuration (`eas.json`)

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      },
      "hooks": {
        "preInstall": "bash eas-build-pre-install.sh",
        "postInstall": "bash eas-build-post-install.sh"
      }
    }
  }
}
```

### NPM Configuration (`.npmrc`)

```
legacy-peer-deps=true
package-lock=false
optional=true
rebuild-bundle=true
```

## 🚀 How to Build

### Production Build
```bash
eas build -p android --profile production
```

### Preview Build
```bash
eas build -p android --profile preview
```

## 🔍 Troubleshooting

### Issue: "Cannot find module '../lightningcss.linux-x64-gnu.node'"
This should now be fixed by the post-install hook. The hook:
1. Checks if lightningcss is installed
2. Verifies the Linux binary exists
3. Reinstalls if missing

### Issue: Peer dependency errors during build
Resolved by `.npmrc` configuration with `legacy-peer-deps=true`

### Issue: Large upload size
Make sure `.easignore` is properly configured and committed

### Issue: Build fails at "Install dependencies"
Check the EAS build logs to see if:
- npm install is using legacy-peer-deps
- The .npmrc file is being read
- All dependencies are resolving correctly

## 📱 Testing Locally

To test your build configuration locally:

```bash
# Clean install
rm -rf node_modules
npm install --legacy-peer-deps

# Verify it works
npm start
```

## ⚠️ Important Notes

1. **No package-lock.json**: We're intentionally not using `package-lock.json` to avoid platform-specific binary issues. This means builds might have slight variations in transitive dependencies.

2. **Build Hooks**: The shell scripts (`eas-build-*.sh`) must be committed to your repository for EAS to use them.

3. **Credentials**: EAS is using remote credentials stored on Expo servers (`Build Credentials -nDW08dOo8`).

## 🔐 Banking App Security Warning

**NOTE**: Your original issue was about banking apps detecting your app as suspicious. The primary cause is that your **release builds are signed with a debug keystore** (see `android/app/build.gradle` line 113).

To fix the banking app security warnings, you need to:
1. Generate a production keystore (see `KEYSTORE_SETUP.md`)
2. Configure proper signing in `android/app/build.gradle`
3. Add security configurations to AndroidManifest.xml

This is separate from the EAS build issues and should be addressed before publishing to production users.

## 📞 Support

If you encounter issues:
1. Check the EAS build logs: https://expo.dev/accounts/dhruvwill/projects/prashant-group/builds
2. Verify all configuration files are committed
3. Check that shell scripts have proper line endings (LF, not CRLF)
4. Review this document for common solutions

---

**Last Updated**: Based on EAS build configuration fixes for native binary platform compatibility.

