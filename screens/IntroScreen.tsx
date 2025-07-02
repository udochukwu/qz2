import { StyleSheet, Text, SafeAreaView } from "react-native";
import { LoadingAnimation } from "../components/LoadingBar";
import { useState } from "react";
import { FetchAddUser } from "../services/backendCalls";
import { getUniqueId } from "react-native-device-info";
import { sign } from "react-native-pure-jwt";
import ErrorScreen from "../components/ErrorScreen";
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { PrimaryButton } from "../components/Button";
import { textStyles } from "../components/styles";
import { setSessionId } from "../services/storage";
import { onboardingStackRouting } from "../services/common";
import { useTranslation } from 'react-i18next';
import React from "react";

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

function IntroScreen({ navigation }: Props) {
  const [isThereAnError, setIsThereAnError] = useState(false);
  const [errorDescription, setErrorDescription] = useState("Something went wrong with the server. Please try again later.");
  const [pressed, setPressed] = useState(false);
  const { t, i18n } = useTranslation();
  const initUserSession = async () => {
    //make a request to the server to get a session_id
    try {
      ///console.log("creating new user")
      const user_id = await getUserId();
      const response = await FetchAddUser(user_id)

      if (response == undefined || response.error) {
        return response;
      }
      setSessionId(response);
      return response;
    }
    catch (error) {
      ///console.log(error)
      return
    }
  }

  const getUserId = async () => {
    const deviceId = await getUniqueId();
    return sign(
      {
        "user_id": deviceId,
        "timestamp": Date.now()
      }, // body
      "mtyH8SsEhyaKBxCY0xKM6shMO748lgUtZaDuxkp6", // secret
      {
        alg: "HS256"
      }
    );
  };

  const onStartPress = async () => {
    setPressed(true)
    const session = await initUserSession()
    if (!session || session.error) {
      setPressed(false);
      setIsThereAnError(true);
      session.error ? setErrorDescription(session.error) : setErrorDescription("Something went wrong with the server. Please try again later.");
      return;
    }

    await onboardingStackRouting(navigation);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ErrorScreen active={isThereAnError} onClose={() => setIsThereAnError(false)} errorDiscription={errorDescription} />
      <LoadingAnimation style={{ flex: 1 }} />
      <Text style={textStyles.primaryText}>
        {t('MeetQuizard')}
      </Text>
      <Text style={{ ...styles.quizardDescription, marginTop: 10 }}>
        {t('MeetQuizardDescription')}
      </Text>
      <PrimaryButton
        testID="intro-get-started-button"
        style={styles.startButton}
        text={t('GetStarted')}
        loadingText={t('Loading')}
        disabled={pressed}
        loading={pressed}
        onPress={onStartPress}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // TODO: change the layout in general and not apply the style on button
  startButton: {
    width: "90%",
    marginBottom: 20,
  },
  quizard: {
    width: 400,
    height: 400,
  },
  meetQuizard: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 30,
    lineHeight: 37,
    height: "6%",
  },
  quizardDescription: {
    width: "90%",
    height: "12%",
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 17,
    lineHeight: 23,
    textAlign: 'center',
  },
});

export default IntroScreen;
