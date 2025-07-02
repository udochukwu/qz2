import Superwall, {
  PaywallInfo,
  SubscriptionStatus,
  SuperwallDelegate,
  SuperwallPlacementInfo,
} from '@superwall/react-native-superwall';
import { requestNotificationPermission } from '../utils/requestNotification';

export class CustomSuperwallDelegate extends SuperwallDelegate {
  handleSuperwallPlacement(placementInfo: SuperwallPlacementInfo): void { 

   }
  subscriptionStatusDidChange(newValue: SubscriptionStatus): void {}
  willDismissPaywall(paywallInfo: PaywallInfo): void {}
  willPresentPaywall(paywallInfo: PaywallInfo): void {
  }
  didDismissPaywall(paywallInfo: PaywallInfo): void {}
  didPresentPaywall(paywallInfo: PaywallInfo): void {}
  paywallWillOpenURL(url: URL): void {}
  paywallWillOpenDeepLink(url: URL): void {}
  handleLog(level: string, scope: string, message?: string, info?: Map<string, any>, error?: string): void {}
  handleCustomPaywallAction(name: string) {
    if (name === 'trigger_notification') {
      requestNotificationPermission();
    }
  }
}
