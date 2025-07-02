import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text} from 'react-native';
import {blockstyles} from './styles';
import Button from '../Button';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';

interface Props {
  explainItText: string;
  visible: boolean;
  onExplainPress: () => void;
  onRecommendedPress: () => void;
}

function StickyFollowUpsContainer({
  explainItText,
  visible,
  onExplainPress,
  onRecommendedPress,
}: Props) {

  const { t } = useTranslation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, fadeAnim]);

  return (
    <Animated.View
      style={[
        blockstyles.container,
        styles.stickyContainer,
        {opacity: fadeAnim},
      ]}>
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(99,60,239,0.1)']}
        style={styles.stickyContainer}>
          <Animated.View
            style={[
              styles.stickyContainer,
              {
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Button
            style={[styles.button, styles.explainItButton]}
            onPress={onExplainPress}>
            <Text style={styles.explainItText}>{explainItText}</Text>
            </Button>
            <Button
              color="secondary"
              style={styles.button}
              onPress={onRecommendedPress}>
              <Text style={styles.recommendedText}>{t('recommendedFollowUp')}</Text>
            </Button>
          </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stickyContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    padding: 0,
  },
  explainItButton: {
    marginLeft: 30,
  },
  button: {
    marginBottom: 12,
    height: 40,
    paddingHorizontal: 10,
  },
  explainItText: {
    color: 'white',
    fontSize: 12,
  },
  recommendedText: {
    color: '#633CEF',
    fontSize: 12,
  },
});

export default StickyFollowUpsContainer;
