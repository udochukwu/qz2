import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Header1 from './components/Header1';
import {blockstyles} from './styles';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';

const sendImage = require('../../assets/sendarrow.png');

interface Props {
  suggestedFollowUps: string[];
  onSelected: (followUp: string) => void;
}

function SuggestedFollowUpContainer({suggestedFollowUps, onSelected}: Props) {
  const { t } = useTranslation();

  return (
    <View style={blockstyles.container}>
      <View style={blockstyles.card}>
        <Header1 header_text={t('recommendedFollowUp')} font_weight="500" />
        {suggestedFollowUps.map((followUp, index) => (
          <TouchableOpacity onPress={() => onSelected(followUp)} key={index}>
            <View
              style={[
                styles.suggestionBlock,
                index + 1 === suggestedFollowUps.length
                  ? styles.suggestionBlockNoBorder
                  : undefined,
              ]}>
              <FastImage style={styles.image} source={sendImage} />
              <Text style={styles.suggestionText}>{followUp}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  suggestionBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  suggestionBlockNoBorder: {
    borderBottomWidth: 0,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    flexWrap: 'wrap',
  },
  image: {
    width: 20,
    height: 20,
  },
});

export default SuggestedFollowUpContainer;
export type {SuggestedFollowUpContainer};
