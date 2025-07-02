import { StyleSheet, View, Text, Linking, Platform, SafeAreaView } from "react-native";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import ProfileContext from "../contexts/ProfileContext";
import Purchases, { IntroEligibility, PurchasesPackage, PurchasesStoreProduct, PurchasesPromotionalOffer, CustomerInfo } from "react-native-purchases"
import ErrorScreen from "../components/ErrorScreen";
import { useTranslation } from "react-i18next";
import { BackArrow } from "../components/BackArrow";
import React from "react";
import { BranchEvent } from "react-native-branch";
import QSpinner from "../components/QSpinner";
import { hapticEffect } from "../services/common";
import LoadingModal from "../components/LoadingModal";
import FeaturesGroupV2 from "../components/PayWall/FeaturesGroupV2";
import { OfferBoxV3 } from "../components/PayWall/OfferBoxV3";
import { getAndroidTrialElligibility } from "./HomeScreen/utils/get-trial-android";
import { EnterReferralModal } from "../components/EnterReferralModal";
import { getProReferral, storage } from "../services/storage";
import { WebView } from "react-native-webview";

import Button from "../components/Button";
import { FetchGetPrices } from "../services/backendCalls";
import { useSubscriptionStatus } from "../hooks/useSubscriptionStatus";

type ProScreenProps = {
    // refferrer can either be "HomeScreen" or  followUpBlock
    navigation: any,
    route: any
}


export default function PayWallV2({ navigation, route }: ProScreenProps) {
    const params = route.params
    const refferer = params?.refferer || "None"

    console.log(refferer)
    const { t } = useTranslation();
    const context = useContext(ProfileContext);
    const [loading, setLoading] = useState(false);
    const [errorState, setErrorState] = useState({
        onRetryFunction: () => { },
        errorTitle: "",
        errorDiscription: ""
    });
    const [packages, setPackages] = useState([]) as [PurchasesPackage[], any];
    const [products, setProducts] = useState([]) as [PurchasesStoreProduct[], any];
    const [selected, setSelected] = useState(0);
    const [product_identifiers, setProduct_identifiers] = useState([]) as [string[], any];
    const [enterReferralOpen, setEnterReferralOpen] = useState(false);
    const {setIsPro} = useSubscriptionStatus();
    useEffect(() => {
        context.mixpanel?.track("Unlock Pro clicked",
            {
                'refferer': refferer,
                'Device Type': Platform.OS,
            });
        
        // Replace RevenueCat's offerings with backend prices
        async function fetchPriceInfo() {
            try {
                const pricingData = context.revenueCatMetadata.prices;
                
                if (pricingData && pricingData.length > 0) {
                    const productPromises = pricingData.map(async (priceData) => {
                        return await FetchGetPrices(priceData.id);
                    });
                    
                    const priceInfoResults = await Promise.all(productPromises);
                    const validPriceInfo = priceInfoResults.filter(item => item !== undefined);
                    
                    // Process price info into format compatible with the rest of the code
                    if (validPriceInfo.length > 0) {
                        // Transform the price info to match the structure expected by the component
                        const transformedProducts = validPriceInfo.map((priceInfo, index) => ({
                            identifier: priceInfo?.price_id,
                            product: {
                                identifier: priceInfo?.price_id,
                                priceString: `${(priceInfo?.unit_amount || 0) / 100} ${priceInfo?.currency}`,
                                price: (priceInfo?.unit_amount || 0) / 100,
                                subscriptionPeriod: priceInfo?.recurring_interval,
                                introPrice: priceInfo?.eligible_for_trial ? pricingData[index].trial_days : 0
                            }
                        }));
                        
                        setPackages(transformedProducts);
                        setProducts(transformedProducts.map(pkg => pkg.product));
                        const product_identifiers = transformedProducts.map(pkg => pkg.product.identifier);
                        setProduct_identifiers(product_identifiers);
                        
                     
                    }
                }
            } catch (error) {
                console.log("Error fetching price info:", error);
                setErrorState({
                    onRetryFunction: fetchPriceInfo,
                    errorTitle: "Error",
                    errorDiscription: "Failed to load subscription options"
                });
            } finally {
            }
        }
        
        fetchPriceInfo();
    }, []);

    
    const getTrialPeriodText = (discountPercentage: number, selected: number, trialPeriod?: number): string => {
      if (getProReferral()) {
        return Platform.OS === "android" ? t('purchaseScreen.freeUnlockAndroid', { discount: 7 }) : t('purchaseScreen.freeUnlock', { discount: 7 })
      } else if (trialPeriod) {
        return Platform.OS === "android" ? t('purchaseScreen.freeUnlockAndroid', { discount: trialPeriod }) : t('purchaseScreen.freeUnlock', { discount: trialPeriod })
      } else {
        return discountPercentage > 10 && selected > 0 ?
            t('purchaseScreen.discountUnlock', { discount: discountPercentage })
            :
            t('purchaseScreen.unlock')                            
      }
    }
    const trialPeriod = products[0] && products[selected] ? products[selected].introPrice : 0;
    console.log("trialPeriod: ", trialPeriod);
    console.log("product selected: ", products[selected]);
    //    const discountPercentage = Math.round((basePrice - (priceDigit / period)) / basePrice * 100);
    const discountPercentage = products[0] && products[selected] ? Math.round((products[0].price - (products[selected].price / 52)) / products[0].price * 100) : 0;
    const session = storage.getString("session_id");
    const object_session = JSON.parse(session!);
    const token = object_session.session_token;

    const handleWebViewNavigationStateChange = (newNavState) => {
        const { url } = newNavState;
        
        // Check if the URL is the success URL
        if (url.includes('https://checkout.quizard.ai/payment?success=true')) {
            // Show success modal
            if (loading) 
                return;
            setLoading(true);
            
            // Set user as pro locally
            
            
            // Navigate back to home screen after a short delay
            setTimeout(async () => {
                await Purchases.invalidateCustomerInfoCache()
                context.getProfileStatus()
                navigation.navigate('Home');
            }, 2000);
        }
    };

    return (
        <Fragment>
            <LoadingModal text={t('purchaseScreen.unlocking')} loading={loading} />
            <EnterReferralModal isModalOpen={enterReferralOpen} onModalClose={() => setEnterReferralOpen(false)} />
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={{ position: "absolute", left: 30 }}>
                        <BackArrow onClick={() => navigation.goBack()} />
                    </View>

                </View>
                <View style={{
                    flex: 1, justifyContent: "flex-end", alignItems: "center"
                }}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}> Quizard </Text>
                        <View style={styles.proContainer}>
                            <Text style={styles.proText}>  Pro  </Text>
                        </View>
                    </View>
                    <View style={styles.featureContainer}>
                        <FeaturesGroupV2 />
                    </View>

                    <View style={styles.subsContainer}>
                        {products.map((product, index) => {
                            const subscriptionPeriod = product.subscriptionPeriod
                            const priceString = product.priceString
                            const price = product.price
                            const basePrice = products[0].price
                            const trialPeriod = product.introPrice ? product.introPrice.period == "P1W" ? 7 : 3 : 0
                            return (
                                <React.Fragment key={index}
                                >
                                    <OfferBoxV3
                                        subscriptionPeriod={subscriptionPeriod!}
                                        priceString={priceString}
                                        selected={selected === index}
                                        priceDigit={price}
                                        basePrice={basePrice}
                                        trialPeriod={trialPeriod}
                                        onSelect={() => setSelected(index)}
                                    />
                                </React.Fragment>
                            );
                        })}
                    </View>
                    {products.length > 0 ?
                        <View style={styles.buttonContainer}>
                <View style={{height: 70 , width: '100%'}}>
        
                    <WebView
                        source={{ 
                            uri: "https://checkout.quizard.ai/"+
                                 "?products=" + product_identifiers.join(',') + 
                                 "&token=" + token + 
                                 "&t=" + trialPeriod 
                                 + "#id=" + products[selected].identifier 
                        }}
                        style={{ flex: 1 }}
                        scrollEnabled={false}
                        onNavigationStateChange={handleWebViewNavigationStateChange}
                    />
                </View>
                            <View style={styles.actionsContainer}>
                                <Text style={styles.terms}>
                                    {t('purchaseScreen.usingApplePay')}
                                </Text>
                                <View style={{ borderWidth: 1, borderColor: '#EEEEEE', height: '80%'  }} />

                              <Text style={styles.terms} onPress={() => Linking.openURL("https://lovely-vault-f15.notion.site/Terms-of-Use-18a469738fd74c9bb7c919981de4bbcd")}>
                                  {t('purchaseScreen.termsAndPrivacy')}
                              </Text>
                             
                            </View>
                        </View>
                        :
                        <QSpinner />
                    }


                </View>
                <ErrorScreen active={errorState.errorTitle != ""}
                    onClose={() => {
                    }}
                    onRetry={errorState.onRetryFunction}
                    errorTitle={errorState.errorTitle}
                    errorDiscription={errorState.errorDiscription} />


            </SafeAreaView >
        </Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        minHeight: "100%",
        paddingVertical: Platform.OS === 'ios' ? 0 : 20,

    },
    header: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        paddingBottom: 12,
        paddingTop: 12,
        zIndex: 1,
        backgroundColor: "white"
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    title: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: 39,
        color: "rgb(47, 47, 47)",
    },
    proContainer: {
        backgroundColor: "#6D56FA",
        borderRadius: 20,
        padding: 2,
        borderColor: "#6D56FA",
        borderWidth: 1,
    },
    proText: {
        fontFamily: "Nunito",
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: 30,
        color: "white",
    },
    featureContainer: {
        width: "100%",
        paddingHorizontal: 25,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 30,
        backgroundColor: "white",
        marginTop: 20,
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
        paddingHorizontal: 15,
    },

    button: {
        width: "100%",
        height: 60,
        backgroundColor: '#6D56FA',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    proReferralColor: {
        backgroundColor: '#F3B516'
    },
    buttonText: {
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 15,
        color: "white",
    },
    terms: {

        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
        color: 'rgb(187, 184, 184)',
    },

    subsContainer: {
        width: "100%",
        paddingHorizontal: 15,
        backgroundColor: "white",
        justifyContent: 'flex-start',
        gap: 15,
    },
    actionsContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    successModalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    successModal: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '80%',
        alignItems: 'center',
    },
    successTitle: {
        fontFamily: 'Montserrat',
        fontWeight: '700',
        fontSize: 24,
        color: '#6D56FA',
        marginBottom: 16,
    },
    successText: {
        fontFamily: 'Nunito',
        fontSize: 16,
        textAlign: 'center',
        color: 'rgb(47, 47, 47)',
    },
});
