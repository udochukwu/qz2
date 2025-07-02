import { useTranslation } from "react-i18next";
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { TouchableWrapper } from "../../../components/TouchableWrapper";
import { selectStyles } from "../styles";
const selectedRadio = require('../../../assets/selected_radio.png');
const unselectedRadio = require('../../../assets/unselected_radio.png');


type Props = {
  onChange: (answer: string) => void;
  options: string[];
}

export const SingleSelect = ({ onChange, options }: Props) => {
  const { t } = useTranslation();
  const [focused, setFocused] = useState([...Array(options.length)].map(_ => false));

  const onOptionSelect = (i: number) => () => {
    setFocused(f => {
      f.forEach((_, j) => f[j] = false);
      f[i] = true;
      return f;
    });
    onChange(options[i]);
  }

  return (
    <ScrollView style={selectStyles.container} contentContainerStyle={selectStyles.containerContent}>
      {options.map((option, i) => (
        <TouchableWrapper key={i} focused={focused[i]} onPress={onOptionSelect(i)}>
          <View style={selectStyles.option}>
            <Text>{option}</Text>
            <Image source={focused[i]? selectedRadio: unselectedRadio} style={selectStyles.radioButton} />
          </View>
        </TouchableWrapper>
      ))}
    </ScrollView>
  );
}

