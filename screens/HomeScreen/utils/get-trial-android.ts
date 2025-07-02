import { CustomerInfo, IntroEligibility } from "react-native-purchases";

export function getAndroidTrialElligibility(customerInfo: CustomerInfo, product_identifiers:string[]): { [productId: string]: IntroEligibility } | null {
    if (Object.keys(customerInfo.entitlements.all).length > 0) {
        //not eligible for any intro offers because the user has previously purchased a subscription
        console.log("Not eligible for any intro offers");
    return null;
    } else {
        // eligible for intro offers for all products
        //Set all status to 2 and description to "Eligible for Introductory Offer"
        return product_identifiers.reduce((acc, productId) => {
            acc[productId] = {
                status: 2,
                description: "Eligible for Introductory Offer"
            }
            return acc;
        }
        , {} as { [productId: string]: IntroEligibility });
    }
}
