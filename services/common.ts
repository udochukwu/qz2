import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { updatePhoneVerificationState } from "./api/featureFlags";
import {
  getSessionId,
  isOnboarded,
  isPhoneVerificationEnabled,
  isPhoneVerified,
  setActiveVersionCall,
  shouldAlertActiveVersion,
  shouldCallActiveVersion,
  setTokensNumber,
  setUserId,
  setSessionId,
} from "./storage";
import { getActiveMobileVersion } from "./api/mobile";
import { APP_STORE_ID, GOOGLE_PLAY_ID, VERSION } from "../constants";
import { Alert, Linking, Platform } from "react-native";
import { MutableRefObject } from "react";
import i18n from "../i18n.config";
import { FetchLoginUser } from "./backendCalls";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { userLoginV4 } from "../services/api/user";

/**
 * @returns Promise<boolean> -- Whether the function navigated to another screen or not.
 */
export const onboardingStackRouting = async (navigation: NavigationProp<ParamListBase>): Promise<boolean> => {
  if (!isPhoneVerified()) {
    await updatePhoneVerificationState();
    if (isPhoneVerificationEnabled()) {
      navigation.navigate("PhoneVerificationScreen");
      return true;
    }
  }

  if (!isOnboarded()) {
    navigation.navigate("Intro2", { onboarding_steps: getSessionId().onboarding_steps });
    return true;
  }

  return false
}


let versionAlertOpen = false;
export const alertForVersionUpdate = async () => {
  if (versionAlertOpen) {
    return;
  }
  if (!shouldCallActiveVersion()) {
    if (shouldAlertActiveVersion()) {
      displayVersionAlert();
    }
    return;
  }

  try {
    const response = await getActiveMobileVersion();
    setActiveVersionCall(response.data.version);
    if (response.data.version === VERSION) {
      return;
    }
  } catch (e) {
    return;
  }

  displayVersionAlert();
}

const displayVersionAlert = () => {
  const title = i18n.t("alertForVersionUpdate.title")
  const message = i18n.t("alertForVersionUpdate.message")
  Alert.alert(title, message, [{ text: i18n.t("alertForVersionUpdate.update"), onPress: openStorePage() }], { cancelable: false, onDismiss: () => versionAlertOpen = false });
  versionAlertOpen = true;
}

const openStorePage = () => async () => {
  if (Platform.OS === 'ios') {
    await Linking.openURL(`https://apps.apple.com/app/apple-store/${APP_STORE_ID}`);
  } else if (Platform.OS === 'android') {
    await Linking.openURL(`https://play.google.com/store/apps/details?id=${GOOGLE_PLAY_ID}`);
  }
  versionAlertOpen = false;
}

let logoutAlertOpen = false;
export const alertAboutLogout = () => {
  if (logoutAlertOpen) {
    return;
  }
  const title = i18n.t("alert.logoutTitle")
  const message = i18n.t("alert.logoutMessage")
  Alert.alert(title, message, undefined, { onDismiss: () => logoutAlertOpen = false });
  logoutAlertOpen = true;
}

export const login = async (): Promise<string | undefined> => {
  const loginResponse = await userLoginV4()
  if (loginResponse.status === 403) {
    return "logout";
  }
  if (loginResponse.status !== 200) {
    return;
  }
  setTokensNumber(loginResponse.data.tokens);
  setUserId(loginResponse.data.login_info.user_id);
  setSessionId(loginResponse.data.login_info);
}

/**
 * @returns 0  -- if a === b
 * @returns -1 -- if a < b
 * @returns 1  -- if a > b
 */
export const compareVersions = (a: string, b: string) => {
  if (a === b) {
    return 0;
  }
  const av = a.split('.').map(i => parseInt(i, 10));
  const bv = b.split('.').map(i => parseInt(i, 10));
  for (let i = 0; i < 3; i++) {
    if (av[i] === bv[i]) {
      continue;
    }
    return av[i] < bv[i]? -1: 1;
  }
}

export const hapticEffect = () => {
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  }
  ReactNativeHapticFeedback.trigger("impactHeavy", options);
}
