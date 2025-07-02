import {Platform} from "react-native"
import Superwall, { LogLevel, SuperwallOptions } from '@superwall/react-native-superwall';
import { RCPurchaseController } from "./RCPurchaseController";
import { SUPERWALL_ANDROID_API_KEY, SUPERWALL_IOS_API_KEY } from "../config";
import { CustomSuperwallDelegate } from "./SuperwallDelegate";

export class SuperWallService {
  
  private purchaseController: RCPurchaseController;

  constructor(_purchaseController: RCPurchaseController) {
    this.purchaseController = _purchaseController;
  }

   configure(userId: string) {
    const options = new SuperwallOptions();
    options.logging.level = LogLevel.Warn;
    Superwall.configure({
      apiKey: Platform.OS === "ios" ? SUPERWALL_IOS_API_KEY : SUPERWALL_ANDROID_API_KEY, 
      options: options, 
      purchaseController: this.purchaseController
    });
    this.purchaseController.configureAndSyncSubscriptionStatus(userId);
    Superwall.shared.identify({userId: userId});
    Superwall.shared.setDelegate(new CustomSuperwallDelegate());
    console.log("CONFIGURED")
  }
}