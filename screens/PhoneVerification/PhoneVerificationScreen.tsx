import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View, SafeAreaView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput, Keyboard } from "react-native";
import CountryPicker, { CountryCode, Country } from 'react-native-country-picker-modal';
import { PrimaryButton } from "../../components/Button";
import { commonStyles, inputStyles, textStyles } from "../../components/styles";
import { TouchableWrapper } from "../../components/TouchableWrapper";
import { postPhoneNumber } from "../../services/api/phoneRegistration";
import { phoneStyles, viewStyles } from "./styles";
import { ErrorResponse } from "../../services/api/common";
import { useTranslation } from "react-i18next";

export type PhoneNumber = {
  countryCode: string;
  phone: string;
}

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

export const PhoneVerificationScreen = ({ navigation }: Props) => {
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [callingCode, setCallingCode] = useState("1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [focusedWrapper, setFocusedWrapper] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const onCountrySelect = (country: Country) => {
    setError("");
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0] || "");
  }

  const onChangeText = (text: string) => {
    setError("");
    setPhoneNumber(text);
  }

  const onVerifyPress = async () => {
    setLoading(true);
    setError("");
    onDefocus();

    var hasError = false;
    const response = await postPhoneNumber(`+${callingCode}${phoneNumber}`)
      .catch((error: ErrorResponse) => {
        hasError = true;
        if (error.status === 400) {
          setError(t('phoneVerificationScreen.invalidPhone'));
        } else if (error.status === 403) {
          setError(t('phoneVerificationScreen.phoneUsed'));
        } else {
          setError(t('phoneVerificationScreen.generalError'));
        }
      });
    setLoading(false);
    if (hasError) {
      return;
    }
    let data: PhoneNumber = { countryCode: callingCode, phone: phoneNumber };
    navigation.navigate("OTPScreen", data)
  };

  const onDefocus = () => {
    Keyboard.dismiss();
    setFocusedWrapper(false);
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={onDefocus}>
          <View>
            <View style={viewStyles.content}>
              <View style={viewStyles.inputSection}>
                <Text style={textStyles.primaryText}>
                  {t('phoneVerificationScreen.enterPhone')}
                </Text>
                <TouchableWrapper focused={focusedWrapper}>
                  <View style={phoneStyles.phoneWrapper}>
                    <CountryPicker
                      {...{
                        countryCode: countryCode,
                        withCallingCode: true,
                        withFilter: true,
                        withCallingCodeButton: true,
                        withFlag: true,
                        onSelect: onCountrySelect,
                      }}
                    />
                    <TextInput
                      style={phoneStyles.phoneInput}
                      placeholder={t('phoneVerificationScreen.phonePlaceholder')}
                      keyboardType="number-pad"
                      onChangeText={onChangeText}
                      onPressIn={() => setFocusedWrapper(true)}
                    />
                  </View>
                </TouchableWrapper>
                <Text style={{ ...textStyles.descriptionText, textAlign: "left" }}>
                  {t('phoneVerificationScreen.messageRates')}
                </Text>
                {error !== "" && (
                  <Text style={{ ...textStyles.errorText, textAlign: "left" }}>
                    {error}
                  </Text>
                )}
              </View>
              <PrimaryButton
                text={t('phoneVerificationScreen.verify')}
                loadingText={t('phoneVerificationScreen.sending')}
                disabled={phoneNumber === "" || loading}
                loading={loading}
                onPress={onVerifyPress}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
