import AnimatedLottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Animated, Dimensions, StyleSheet } from 'react-native';
const spin = require('../../assets/loading/spin.json');
const done = require('../../assets/loading/spinvalid.json');

const UNDERSTANDING_DURATION = 2000; // Duration for the first step
export const DONE_DURATION = 1000; // Duration for the 'done' animation
export const SWIPE_OUT_DURATION = 200; // Duration for the swipe out animation

function LoadingBlock({ step, onComplete }: { step: number, onComplete?: () => void }) {

  const { t } = useTranslation()
  const [understandingStatus, setUnderstandingStatus] = useState('loading');
  const [answeringStatus, setAnsweringStatus] = useState('pending');
  const translateY = useState(new Animated.Value(0))[0];
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (step === 1) {
      setUnderstandingStatus('loading');
      setTimeout(() => {
        setUnderstandingStatus('complete');
        setTimeout(() => {
          setAnsweringStatus('loading');
        }, DONE_DURATION);
      }, UNDERSTANDING_DURATION);
    } else if (step === 2) {
      setAnsweringStatus('complete');
      setUnderstandingStatus('complete');
      setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -screenWidth,
          duration: SWIPE_OUT_DURATION,
          useNativeDriver: false,
        }).start(onComplete);
      }, DONE_DURATION);
    }
  }, [step]);

  return (
    <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: "#F9F8F8" }}>
      <Animated.View style={{ transform: [{ translateY: translateY }], flexDirection: 'column', alignItems: "center", justifyContent: "center" }}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>

          <AnimatedLottieView source={require('../../assets/loading/loading.json')} autoPlay loop style={{ width: 300, height: 300, marginBottom: 20 }} />
          <View>
            <View style={styles.stepContainer}>
              <AnimatedLottieView source={understandingStatus === 'loading' ? spin : done} autoPlay loop={understandingStatus === 'loading'} style={{ width: 20, height: 20 }} />
              <Text style={styles.loadingText}>{t('loadingBlock.understanding')}</Text>
            </View>
            {(answeringStatus === 'loading' || answeringStatus === 'complete') && (
              <View style={styles.stepContainer}>
                <AnimatedLottieView source={answeringStatus === 'loading' ? spin : done} autoPlay loop={answeringStatus === 'loading'} style={{ width: 20, height: 20 }} />
                <Text style={styles.loadingText}>{t('loadingBlock.answering')}</Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    fontFamily: 'Montserrat',
    fontSize: 17,
    color: '#5D5D5D',
    fontWeight: '400',
    marginLeft: 10,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 15
  },

});
export default LoadingBlock;
