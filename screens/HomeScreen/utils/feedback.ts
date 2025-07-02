import { useEffect } from "react";
import { hasFeedback, giveFeedback, appOpensCount } from "../../../services/storage";
import { Alert } from "react-native";
import { inAppReviewHandler } from "../../../components/Blocks/components/FeedbackButtons";
import i18n from "../../../i18n.config";


export const useFeedbackAlert = () =>
  useEffect(() => {
    if (!shouldShowFeedbackAlert()) {
      return;
    }
    Alert.alert(i18n.t('homeScreen.title'), i18n.t('homeScreen.message'),
      [
        { text: i18n.t('homeScreen.dismiss'), style: "cancel" },
        { text: i18n.t('homeScreen.ok'), onPress: async () => {
            const success = await inAppReviewHandler();            
            if (success) { 
              giveFeedback();
            }
          } }
      ],
      { cancelable: false }
    );
  }, []);
  export const shouldShowFeedbackAlert = () => {
    // Don't show Superwall if feedback alert should be shown
    if (hasFeedback() || appOpensCount() % 3 !== 0) {
      return false;
    }
    return true;
  };