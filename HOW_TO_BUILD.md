npx expo prebuild

cd android

# Debug APK
./gradlew assembleDebug

# Release APK (needs keystore setup)
./gradlew assembleRelease