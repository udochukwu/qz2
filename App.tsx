import 'react-native-gesture-handler';
import { useEffect, useRef, useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Mixpanel } from "mixpanel-react-native";
import { AppState, Linking, LogBox, Platform, View, Pressable } from 'react-native';
import ProfileContext, { ProfileContextType } from './contexts/ProfileContext';
import { IntroScreen, IntroScreen2, SettingsScreen, ExitSurveyScreen, ChromeScreen, Calculator } from './screens/index';
import HistoryScreen from './screens/HistoryScreen';
import Purchases from "react-native-purchases";
import { getUniqueId } from "react-native-device-info";
import messaging from '@react-native-firebase/messaging';
import BlocksScreen from './screens/BlocksScreen';
import { PhoneVerificationScreen, OTPScreen } from './screens/PhoneVerification';
import { PhoneNumber } from './screens/PhoneVerification/PhoneVerificationScreen';
import { storage, isOnboarded, hasSessionId, isPhoneVerified, isPhoneVerificationEnabled, logout as storageLogout, setTokensNumber, getTokensNumber, getUserId, setIsProLocally } from './services/storage';
import { updatePhoneVerificationState } from './services/api/featureFlags';
import { LoadingScreen } from './screens/LoadingScreen';
import { login, alertAboutLogout, alertForVersionUpdate, hapticEffect } from './services/common';
import "./i18n.config";
import ReferralScreen from './screens/ReferralScreen';
import branch from 'react-native-branch';
import { FetchAddReferral, FetchClaimTokens, setExperiment } from './services/backendCalls';
import { DynamicSurveyScreen } from './screens/DynamicSurvey/index';
import React from 'react';
import { SocketContextProvider } from './services/socket';
import analytics from '@react-native-firebase/analytics';
import { init, wrap } from '@sentry/react-native';
import LinkScreen from './screens/Chrome/LinkScreen';
import ChromeGuideScreen from './screens/Chrome/GuideScreen';
import EarnTokensScreen from './screens/EarnTokensScreen';
import { SuperWallService } from './services/Superwall';
import { RCPurchaseController } from './services/RCPurchaseController';
import { useSubscriptionStatus } from './hooks/useSubscriptionStatus';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeIcon } from './screens/HomeScreen/components/HomeIcon';
import { CalculatorIcon } from './screens/HomeScreen/components/CalculatorIcon';
import { ProfileIcon } from './screens/HomeScreen/components/ProfileIcon';
import Superwall from '@superwall/react-native-superwall';
import PaywallV2 from './screens/PaywallV2';
import { WebView } from 'react-native-webview';
import BottomTabDisplayProvider, { useBottomTabDisplay } from './contexts/BottomTabDisplayContext';

const Tab = createBottomTabNavigator();

init({
  dsn: 'https://991b73843fae2c30cbce2f303179c2f6@o4504557198573568.ingest.sentry.io/4505813304475648',
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  enabled: process.env.NODE_ENV === 'production' ? true : false,
  enableAppHangTracking: false,
});


type OnboardingStackParamList = {
  Loading: undefined;
  Intro: undefined;
  Intro2: undefined;
  PhoneVerificationScreen: undefined;
  OTPScreen: PhoneNumber;
  Email: undefined;
}

const OnboardingStack = createStackNavigator<OnboardingStackParamList>();
const MainStack = createStackNavigator();

const RegisterAndOboardStackScreen = () => (
  <OnboardingStack.Navigator initialRouteName="Intro">
    <OnboardingStack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false, gestureEnabled: false }} />
    <OnboardingStack.Screen name="Intro" component={IntroScreen} options={{ headerShown: false, gestureEnabled: false }} />
    <OnboardingStack.Screen name="PhoneVerificationScreen" component={PhoneVerificationScreen} options={{ headerShown: false, gestureEnabled: false }} />
    <OnboardingStack.Screen name="OTPScreen" component={OTPScreen} options={{ headerShown: false }} />
    <OnboardingStack.Screen name="Intro2" component={IntroScreen2} options={{ headerShown: false, gestureEnabled: false }} />
  </OnboardingStack.Navigator>
);

const enum Tabs {
  HOME = "Home",
  CALCULATOR = "Calculator",
  PROFILE = "Profile"
}

const TabNavigator = () => {
  const {isBottomTabVisible} = useBottomTabDisplay()
  
  const handleTabPress = () => {
    hapticEffect()
  };

  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={({ route }) => ({
      tabBarIcon: ({ focused }) => {
        let icon;
        if (route.name === Tabs.HOME) {
          icon = HomeIcon(focused)
        } else if (route.name === Tabs.CALCULATOR) {
          icon = CalculatorIcon(focused)
        } else if (route.name === Tabs.PROFILE) {
          icon = ProfileIcon(focused)
        }
        return <View>{icon}</View>
      },
      tabBarStyle: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        position: "absolute",
        height: 93,
        borderColor: 'white',
        display: isBottomTabVisible ? "flex" : "none"
      },
      tabBarItemStyle: {
        top: '20%'
      },
      tabBarActiveTintColor: "#6D56FA",
      tabBarInactiveTintColor: "rgba(21, 17, 43, 0.5)",
      tabBarButton: (props) => (
        <Pressable
          {...props}
          onPress={(e) => {
            handleTabPress();
            props.onPress?.(e);
          }}
        />
      ),
    })}>
   
    <Tab.Screen name="Calculator" component={Calculator} options={{ headerShown: false }} />
    <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Profile" component={SettingsScreen} options={{ headerShown: false }} />
  </Tab.Navigator>
  )
}

const MainStackScreen = () => (
  <MainStack.Navigator initialRouteName="Tabs">
    <MainStack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
    <MainStack.Screen name="Referral" component={ReferralScreen} options={{ headerShown: false, gestureEnabled: false }} />
    <MainStack.Screen name="ExitSurvey" component={ExitSurveyScreen} options={{ headerShown: false }} />
    <MainStack.Screen name="History" component={HistoryScreen} options={{ headerShown: false, presentation: 'modal' }} />
    <MainStack.Screen name="Blocks" component={BlocksScreen} options={{ headerShown: false, presentation: 'modal' }} />
    <MainStack.Screen name="DynamicSurvey" component={DynamicSurveyScreen} options={{ headerShown: false, presentation: 'modal' }} />
    <MainStack.Screen name="Chrome" component={ChromeScreen} options={{ headerShown: false }} />
    <MainStack.Screen name="Link" component={LinkScreen} options={{ headerShown: false }} />
    <MainStack.Screen name="Earn" component={EarnTokensScreen} options={{ headerShown: false }} />
    <MainStack.Screen name="ChromeGuide" component={ChromeGuideScreen} options={{ headerShown: false }} />
    <MainStack.Screen name="Calculator" component={Calculator} options={{ headerShown: false, gestureEnabled: false }} />
    <MainStack.Screen name="PaywallV2" component={PaywallV2} options={{ headerShown: false }} />
  </MainStack.Navigator>
);



async function getFcmTken() {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {

    } else {

    }
  }
  catch (e) {
    console.log("error", e)
  }
}
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

const App: () => React.JSX.Element = () => {
  LogBox.ignoreAllLogs();

  //intro screen logic
  const [mainStackReady, setMainStackReady] = useState(false);
  const {isPro} = useSubscriptionStatus()
  const [tokens, setTokens] = useState<number>(getTokensNumber());
  const [claimTokens, setClaimTokens] = useState(undefined as unknown as boolean);
  const [purchaseConfiqured, setPurchaseConfigured] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const navigationRef = useRef(null);
  const [revenueCatMetadata, setRevenueCatMetadata] = useState<ProfileContextType['revenueCatMetadata']>({
    is_native_paywall: false,
    rc_experiment_group: undefined,
    prices: [  
      {
        "id": "price_1RKNpzCAPSSuKlSo1vmIf1TI",
        "trial_days": 3
      },
      {
        "id": "price_1RKONSCAPSSuKlSo06AIEDPp",
        "trial_days": 3
      }
  ]
  });
  const [revenueCatDataUpdated, setRevenueCatDataUpdated] = useState(false);
  const trackAutomaticEvents = false;
  const mixpanel = new Mixpanel("4f82a74182177ccad946b1f91d2056aa", trackAutomaticEvents);
  const [showApplePayWebView, setShowApplePayWebView] = useState(false);

  const handleApplePayMessage = (event: any) => {
    const status = event.nativeEvent.data;
    if (status === 'unknown' || status === 'unavailable' || status === 'unsupported') {
      setRevenueCatMetadata((prev) => ({
        ...prev,
        is_native_paywall: false,
      }));
    }
    setShowApplePayWebView(false);
  };

  useEffect(() => {
    //storage.clearAll();
    //storage.delete("referral_code");    requestUserPermission()
    //get FCM token
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      messaging().registerDeviceForRemoteMessages();
    }
    getFcmTken()
    const count = storage.getNumber("app_opened_count");
    if (count === undefined) {
      let app_count = Platform.OS === "ios" ? 1 : 2;
      storage.set("app_opened_count", app_count);
    } else {
      storage.set("app_opened_count", count + 1);
    }

    getSessionData()
  }, [])
  useEffect(() => {
    const setupSubscription = async () => {
      try {
        const userId = getUserId() || await getUniqueId();
        new SuperWallService(new RCPurchaseController()).configure(userId);
        setPurchaseConfigured(true)
      } catch (e) {
        console.log("error2", e)
      }
    }
    setupSubscription()
  }, [])


  useEffect(() => {
    // alert to ask user to update the app
    alertForVersionUpdate();
    const subscription = AppState.addEventListener('change', nextAppState => {
      const currAppState = appState.current;
      if ((currAppState === 'inactive' || currAppState === 'background') && nextAppState === 'active') {
        alertForVersionUpdate();
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);


  const getSessionData = async () => {
    setMainStackReady(hasSessionId() && isOnboarded() && (isPhoneVerified() || !isPhoneVerificationEnabled()));
    if (hasSessionId()) {
      const response = await login();
      if (response === "logout") {
        alertAboutLogout();
        logout();
        return;
      }
      setTokens(getTokensNumber());
      await updatePhoneVerificationState();
    }
  }

  useEffect(() => {
    if (purchaseConfiqured) {
      //Make sure a user has a session id before calling getProfileStatus (can't see experiment group without a session id)
      if (hasSessionId())
        getProfileStatus()
    }
  }, [purchaseConfiqured])

  const getProfileStatus = async () => {
    try {
      if (!purchaseConfiqured) return;
      Purchases.enableAdServicesAttributionTokenCollection();
      let tempRevenueCatMetadata = { ...revenueCatMetadata }
      const customerInfo = await Purchases.getCustomerInfo();
      setIsProLocally(typeof customerInfo.entitlements.active["pro"] !== 'undefined');
      Purchases.getOfferings().then((offerings) => {
        console.log(offerings.current?.metadata)
        if (offerings.current && offerings.current.metadata.rc_experiment_group) {
          const rc_experiment_group = offerings.current.metadata.rc_experiment_group as string;
          setExperiment(rc_experiment_group)
          Superwall.shared.setUserAttributes({
            "rc_experiment_group": rc_experiment_group
          })
          tempRevenueCatMetadata.rc_experiment_group = rc_experiment_group
        }
        else {
          setExperiment()
        }
        if (offerings.current && offerings.current.metadata.is_native_paywall) {
          tempRevenueCatMetadata.is_native_paywall = offerings.current.metadata.is_native_paywall as boolean;
          tempRevenueCatMetadata.prices = offerings.current.metadata.prices as { id: string; trial_days: number }[];
          console.log("setting showApplePayWebView to true")
          setShowApplePayWebView(true);
        }
        setRevenueCatMetadata(tempRevenueCatMetadata)
        setRevenueCatDataUpdated(true)
      }).catch((e) => {
        setRevenueCatDataUpdated(true)
        console.log("error", e)
      })
    } catch (e) {
      console.log("error", e)
    }
  }

  const logout = () => {
    storageLogout();
    setMainStackReady(false);
  }

  useEffect(() => {
    branch.subscribe({
      onOpenStart: ({
        uri,
        cachedInitialEvent
      }) => {
        console.log(
          'subscribe onOpenStart, will open ' +
          uri +
          ' cachedInitialEvent is ' +
          cachedInitialEvent,
        );
      },
      onOpenComplete: ({
        error,
        params,
        uri
      }) => {
        if (error) {
          console.error(
            'subscribe onOpenComplete, Error from opening uri: ' +
            uri +
            ' error: ' +
            error,
          );
          return;
        }
        else if (params) {
          if (!params['+clicked_branch_link']) {
            if (params['+non_branch_link'] && typeof params['+non_branch_link'] === 'string') {
              // Route based on non-Branch links
              Linking.openURL(params['+non_branch_link']);
              return;
            }
          } else {
            let referralCode = params.referral as string;
            if (referralCode !== undefined) {
              storage.set("referral_code", referralCode)
              if (hasSessionId()) {
                FetchAddReferral(referralCode)
              }
            }
            let claim = params.claim as string;
            if (claim === "true") {
              FetchClaimTokens("daily_checkin").then((response) => {
                if (response && response.tokens) {
                  setClaimTokens(true)
                  setTokens(response.tokens)
                } else {
                  setClaimTokens(false)
                }
              })
            } else {
              setClaimTokens(false)
            }
            let deepLinkPath = params.$deeplink_path as string;
            if (deepLinkPath === "email" && navigationRef.current) {
              navigationRef.current.navigate("Email")
              return
            }
            // Route based on Branch link data 
            return
          }
        }
      },
    });
  }, [])
  //select stack based on onboarding status and registration status from OnboardingStackScreen and MainStackScreen and RegisterAndOboardStackScreen
  return (
    <NavigationContainer
    ref = {navigationRef}
    >
      <ProfileContext.Provider value={{
        pro: isPro, getProfileStatus, checkOnboarded: getSessionData, logout, tokens, setTokens: (n_tokens) => {
          setTokens(n_tokens)
          //Save it locally
          setTokensNumber(n_tokens)
        },
        setClaimTokens,
        claimTokens,
        revenueCatMetadata,
        mixpanel,
      }}>
        {
          mainStackReady
            ?
            revenueCatDataUpdated
              ? <SocketContextProvider>
                <BottomTabDisplayProvider>
                <MainStackScreen />
                </BottomTabDisplayProvider>
                </SocketContextProvider>
              : <></>
            : <RegisterAndOboardStackScreen/>
        }
        <View style={{ position: 'relative', bottom: 0, width: 0, height: 0, left: 0, zIndex: -1 }}>
          {showApplePayWebView && (
            <WebView
              source={{ uri: 'https://checkout.quizard.ai/check-apple-pay' }}
            onMessage={handleApplePayMessage}
          />
        )}
        </View>
      </ProfileContext.Provider>
    </NavigationContainer>
  );
};


export default wrap(App);
