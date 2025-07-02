import { View } from "react-native"
import LottieView from 'lottie-react-native';
const illustration = require('../../../assets/lottie/survey_illustration.json');

export const SurveyIllustration = () => {
  return (
    <View style={{ height: "30%", width: '100%' }} >
      <LottieView source={illustration} loop autoPlay />
    </View>
  );
}
