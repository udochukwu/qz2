import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  PurchasesStoreProduct,
  CustomerInfo,
  MakePurchaseResult,
  PRODUCT_CATEGORY,
  SubscriptionOption,
} from 'react-native-purchases';

import analytics from '@react-native-firebase/analytics';
import branch from 'react-native-branch';
import firebase from '@react-native-firebase/app';
import { Mixpanel } from 'mixpanel-react-native';
import { setUser } from '@sentry/react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { MIXPANEL_API_KEY, REVENUE_CAT_ANDROID_API_KEY, REVENUE_CAT_IOS_API_KEY } from '../config';

const trackAutomaticEvents = false;
const mixpanel = new Mixpanel(MIXPANEL_API_KEY, trackAutomaticEvents);

async function getFirebaseInstanceID() {
  try {
    const appInstanceId = await analytics().getAppInstanceId();
    if (appInstanceId) {
      return appInstanceId;
    } else {
      return "";
    }
  }
  catch (e) {
    console.log("error", e)
    return "";
  }
}

export class RevenueCat {
  static async setUpConfiguration(userId: string) {
    try {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE)
      branch.setIdentity(userId)
      firebase.analytics().setUserId(userId)
      mixpanel.init();
      mixpanel.identify(userId);
      Purchases.configure({
        apiKey: Platform.OS === "ios" ? REVENUE_CAT_IOS_API_KEY : REVENUE_CAT_ANDROID_API_KEY,
        appUserID: userId,
      })
      setUser({ id: userId }); //For Sentry
      const instance_id = await getFirebaseInstanceID();
      if (instance_id !== "") {
        Purchases.setFirebaseAppInstanceID(instance_id);
      }
      Purchases.collectDeviceIdentifiers();
      Purchases.enableAdServicesAttributionTokenCollection();
      const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      if (result === RESULTS.DENIED) {
        // The permission has not been requested, so request it.
        await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY).then((result) => {
          Purchases.collectDeviceIdentifiers();
          Purchases.enableAdServicesAttributionTokenCollection();
        });
      }
    } catch (e) {
      console.log("RevenueCat config error", e)
    }
  }



  static async makePurchase(offering: PurchasesStoreProduct): Promise<MakePurchaseResult> {
    try {
      return await Purchases.purchaseStoreProduct(offering);
    } catch (error) {
      throw error;
    }
  }

  static async checkSubscriptionStatus() {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.activeSubscriptions.length > 0 || Object.keys(customerInfo.entitlements.active).length > 0;
  }

  static async checkIfFreeTrialAvailable(productIdentifiers: string[]) {
    try {
      const eligibilities = await Purchases.checkTrialOrIntroductoryPriceEligibility(productIdentifiers);
      return eligibilities;
    } catch (error) {
      throw error;
    }
  }



  static async restorePurchases(): Promise<CustomerInfo> {
    return await Purchases.restorePurchases();
  }

  static addCustomerInfoUpdateListener(callback: (info: CustomerInfo) => void) {
    Purchases.addCustomerInfoUpdateListener(callback);
  }

  static async getProducts(productId: string, category: PRODUCT_CATEGORY) {
    return Purchases.getProducts([productId], category);
  }

  static async purchaseSubscriptionOption(option: SubscriptionOption) {
    return Purchases.purchaseSubscriptionOption(option);
  }
}
