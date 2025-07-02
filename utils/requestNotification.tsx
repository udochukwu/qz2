import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

export async function requestNotificationPermission() {
  console.log("requestNotificationPermission")
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      console.log("authStatus", authStatus)
      if (enabled) {
      }
    }
    else if (Platform.OS === 'android') {
      const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      if (result === RESULTS.DENIED) {
        // The permission has not been requested yet and is denied
        await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      }
    }
  }