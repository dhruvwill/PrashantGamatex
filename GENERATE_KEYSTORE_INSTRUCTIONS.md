# Generate Release Keystore - Manual Steps

## Step 1: Generate the Keystore

Open PowerShell **as Administrator** and run:

```powershell
cd D:\Projects\PrashantGroup\PrashantGamatex\android\app
& "C:\Program Files\Java\jdk-17\bin\keytool.exe" -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**Important:** In PowerShell, you must use `&` before a quoted executable path to run it properly.

**When prompted, enter:**
1. **Keystore password**: Enter a password (at least 6 characters) - **REMEMBER THIS!**
2. **Re-enter password**: Enter the same password again
3. **Key password**: Press Enter to use the same password, or enter a different one
4. **First and last name**: Your name or company name (e.g., "Prashant Group")
5. **Organizational unit**: Press Enter or enter department name
6. **Organization**: Your company name (e.g., "Prashant Group")
7. **City**: Your city
8. **State**: Your state/province
9. **Country code**: Two letters (e.g., IN, US, UK)

**Example:**
```
Enter keystore password: [Enter your password - at least 6 chars]
Re-enter new password: [Enter same password]
What is your first and last name?
  [Unknown]:  Prashant Group
What is the name of your organizational unit?
  [Unknown]:  [Press Enter]
What is the name of your organization?
  [Unknown]:  Prashant Group
What is the name of your City or Locality?
  [Unknown]:  Mumbai
What is the name of your State or Province?
  [Unknown]:  Maharashtra
What is the two-letter country code for this unit?
  [Unknown]:  IN
```

After successful generation, you'll see:
```
[Storing my-upload-key.keystore]
```

## Step 2: Verify Keystore was Created

Check that the file exists:
```powershell
ls my-upload-key.keystore
```

You should see the file listed.

## Step 3: Configure Gradle Properties

After generating the keystore, you'll need to update `android/gradle.properties` with your credentials.

