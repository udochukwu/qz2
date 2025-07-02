import { useTranslation } from "react-i18next";
import { StyleSheet, Keyboard, Text, KeyboardAvoidingView, Platform, SafeAreaView, TouchableWithoutFeedback, View, ScrollView } from "react-native";
import { PrimaryButton } from "../../components/Button";
import { commonStyles, textStyles } from "../../components/styles";
import BarWithGesture from "../../components/BarWithGesture";
import { NavigationProp, ParamListBase, Route, useFocusEffect } from "@react-navigation/native";
import { Survey, answerDynamicSurvey, skipDynamicSurvey } from "../../services/api/dynamicSurvey";
import { OpenEndend } from "./components/OpenEnded";
import { SurveyIllustration } from "./components/Illustartion";
import { useCallback, useRef, useState } from "react";
import { MultiSelect } from "./components/MultiSelect";
import { SingleSelect } from "./components/SingleSelect";
import { dynamicSurveyStyles } from "./styles";
import { setSurveyDisplayTimeout } from "../../services/storage";

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: Route<"DynamicSurvey", Survey>;
}

const setInitialSurvey = (survey: Survey): Survey => {
  if (survey.type === 'NESTED' && survey.questions && survey.questions.length > 0) {
    return survey.questions[0]
  }
  return survey;
}

export const DynamicSurveyScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const answered = useRef(false);
  const [surveyIndex, setSurveyIndey] = useState(0);
  const [currSurvey, setCurrSurvey] = useState(setInitialSurvey(route.params));

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (!answered.current) {
          skipDynamicSurvey(currSurvey.id);
        }
        setSurveyDisplayTimeout();
      };
    }, [])
  );

  const onSubmit = async () => {
    setLoading(true);
    await answerDynamicSurvey(currSurvey.id, answers);
    answered.current = true;
    setLoading(false);
    if (route.params.type === 'NESTED' && route.params.questions && surveyIndex < route.params.questions.length - 1) {
      setCurrSurvey(route.params.questions[surveyIndex + 1]);
      setSurveyIndey(surveyIndex + 1);
      setAnswers([]);
      answered.current = false;
      return;
    }
    navigation.navigate("Home");
  }

  const onDefocus = () => {
    Keyboard.dismiss();
    setFocused(false);
  }

  const renderInput = () => {
    if (currSurvey.type === 'OPEN_ENDED') {
      return <OpenEndend focused={focused} setFocused={setFocused} onChange={(t) => setAnswers([t])} text={answers[0]} />
    }
    if (currSurvey.type === 'SINGLE_SELECT') {
      return <SingleSelect options={currSurvey.options ?? []} onChange={(answer) => setAnswers([answer])} />
    }
    if (currSurvey.type === 'MULTI_SELECT') {
      return <MultiSelect options={currSurvey.options ?? []} onChange={setAnswers} />
    }
  }

  const getPButtonText = (): string => {
    if (route.params.type !== 'NESTED') {
      return t('dynamicSurveyScreen.submit');
    }
    if (route.params.questions && surveyIndex === route.params.questions.length - 1) {
      return t('dynamicSurveyScreen.finish')
    }
    return t('dynamicSurveyScreen.next');
  }

  return (
    <SafeAreaView style={commonStyles.maxContent}>
      <KeyboardAvoidingView style={[commonStyles.maxContent, dynamicSurveyStyles.innerContent]} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={60}>
        <TouchableWithoutFeedback onPress={onDefocus}>
          <View style={dynamicSurveyStyles.content}>
            <BarWithGesture onSwipeDown={() => { }} />
            <SurveyIllustration />
            <Text style={textStyles.questionText}>
              {currSurvey.question}
            </Text>
            {renderInput()}

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View style={{ padding: 12 }}>
        <PrimaryButton
          text={getPButtonText()}
          loadingText={t('dynamicSurveyScreen.submitting')}
          disabled={answers.length === 0 || answers[0] === "" || loading}
          loading={loading}
          onPress={onSubmit}
        />
      </View>
    </SafeAreaView >
  );
}

