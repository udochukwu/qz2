import { useEffect, useState } from 'react';
import Purchases, { CustomerInfo, CustomerInfoUpdateListener } from 'react-native-purchases';

export const fetchSubscriptionStatus = async (): Promise<boolean> => {
  try {
    await Purchases.isConfigured();
    const customerInfo = await Purchases.getCustomerInfo();
    const isRevenuecatPro = customerInfo.entitlements.active['pro'] !== undefined;
    return isRevenuecatPro;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
};

export const useSubscriptionStatus = () => {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const getStatus = async () => {
      const status = await fetchSubscriptionStatus()
      setIsPro(status);
    }
    getStatus();

    const listener: CustomerInfoUpdateListener = (customerInfo: CustomerInfo) => {
      setIsPro(customerInfo.entitlements.active["pro"] !== undefined);
    };

    Purchases.addCustomerInfoUpdateListener(listener);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);

    };

  }, []);

  return {isPro,setIsPro}


}
