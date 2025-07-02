import { NavigationProp, ParamListBase, Route, RouteProp } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { Text, View, SafeAreaView, StyleSheet, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput, Keyboard } from "react-native";
import { BackArrow } from "../../components/BackArrow";
import { PrimaryButton } from "../../components/Button";
import { commonStyles, textStyles } from "../../components/styles";
import { TouchableWrapper } from "../../components/TouchableWrapper";
import { ErrorResponse } from "../../services/api/common";
import { OTPVerificationResponse, verifyOTP } from "../../services/api/phoneRegistration";
import { getSessionId, setOnboarded, setPhoneVerified, setSessionId, storage } from "../../services/storage";
import { GetHelpButton } from "./components/GetHelpButton";
import { OTPInput } from "./components/OTPInput";
import { ResendButton } from "./components/ResendButton";
import { PhoneNumber } from "./PhoneVerificationScreen";
import { phoneStyles, viewStyles } from "./styles";
import { useTranslation } from "react-i18next";

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: Route<"OTPScreen", PhoneNumber>;
  // OR: RouteProp<OnboardingStackParamList, "OTPScreen">
}


export const OTPScreen = ({ navigation, route }: Props) => {
  const [focusedWrapper, setFocusedWrapper] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOTP] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const onSubmit = async () => {
    setLoading(true);
    setError("");
    onDefocus();

    var hasError = false;
    const response = await verifyOTP(otp).then(v => {
      setSessionId(v.data);
      setOnboarded(v.data.onboarded);
    }).catch((error: ErrorResponse) => {
      hasError = true;
      if (error.status === 400) {
        setError(t('otpScreen.wrongOTP'));
      } else {
        setError(t('otpScreen.generalError'));
      }
    })
    setLoading(false);
    if (hasError) {
      return;
    }

    setPhoneVerified(true);
    navigation.navigate("Loading");
  }

  const onDefocus = () => {
    Keyboard.dismiss();
    setFocusedWrapper(false);
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={onDefocus}>
          <View>
            <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <BackArrow onClick={() => !loading && navigation.goBack()} />
              <GetHelpButton />
            </View>
            <View style={viewStyles.content}>
              <View style={viewStyles.inputSection}>
                <Text style={textStyles.primaryText}>
                  {t('otpScreen.sentCode')}
                </Text>
                <Text style={{ ...textStyles.descriptionText, textAlign: "left" }}>
                  {t('otpScreen.sentTo')} {formatPhoneNumber(route.params.countryCode, route.params.phone)}
                </Text>
                <OTPInput onOTPChange={setOTP} />
                <ResendButton />
                {error !== "" && (
                  <Text style={{ ...textStyles.errorText, textAlign: "left" }}>
                    {error}
                  </Text>
                )}
              </View>
              <PrimaryButton
                text={t('otpScreen.submit')}
                loadingText={t('otpScreen.checking')}
                disabled={(otp.length !== 6) || loading}
                loading={loading}
                onPress={onSubmit}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const formatPhoneNumber = (countryCode: string, phone: string) => {
  let split = 3;
  let formattedPhone = phone.substr(0, split);
  let i = 3;
  while (i < phone.length) {
    if (phone.substr(i, phone.length).length <= split + 1) {
      split += 1;
    }
    formattedPhone += "-" + phone.substr(i, split);
    i += split;
  }
  return `+${countryCode} ${formattedPhone}`;
}
