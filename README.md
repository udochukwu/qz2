# Quizard AI MobileApp

Stack: React-Native 🚀

## Run Locally

We can run the app locally for iOS and Android.  
Before doing so, we need to do some of the prerequisite.

### Pre-Steps

1. yarn install

```

> Make sure to have cocopods installed: https://cocoapods.org/

2. **[OPTIONAL]**, if you want to point the app to local backend server, change `API.js` to:

```
export const API = "http://localhost:5000"
```


3. Make sure to have the `setup-ios-permissions` setup:

```

npx react-native setup-ios-permissions
```

4. Install [Android Studio](https://developer.android.com/studio)

### iOS

For iOS we need to run the following steps:

1. install ios dependencies

```
cd ios && pod install && cd ..
```

2. Run ios app

```
yarn start
```

In case you are facing issues with permissions even after going through the above steps, make sure to do the following actions:

1. xcode > File > Workspace Settings... > DerivedData > **delete folder**
2. xcode > Product > Clean Build Folder
3. re-run above steps again

### Android

For Android we need to run the following steps:

1. Have an Android emulator up and running, can verfiy with the following command:

```
adb devices
```

> Make sure to have `adb` installed (ex. `brew install android-platform-tools`).

2. Export a port from Android device to a host port

```
adb [-s DEVICE-ID] reverse tcp:5000 tcp:5000
adb [-s DEVICE-ID] reverse tcp:8081 tcp:8081
```

> You potentially don't need both pots but only the one your API is running into.

3. Run android app

```
yarn start android

# or

npx react-native run-android --mode amazonDebug
```

In case you are facing issues, you can do the following steps:

1. Clean the previous build:

```
cd android && ./gradlew clean && cd ..
```

2. Re-run the previous steps

3. If this is still failling, you can `File > Invalidate Caches...` from Android Studio
# qz2
