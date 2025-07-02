import { useTranslation } from "react-i18next";
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { TouchableWrapper } from "../../../components/TouchableWrapper";
import { selectStyles } from "../styles";
const selectedCheckbox = require('../../../assets/selected_checkbox.png');
const unselectedCheckbox = require('../../../assets/unselected_checkbox.png');

type Props = {
  onChange: (answers: string[]) => void;
  options: string[];
}

export const MultiSelect = ({ onChange, options }: Props) => {
  const { t } = useTranslation();
  const [focused, setFocused] = useState([...Array(options.length)].map(_ => false));

  const onOptionSelect = (i: number) => () => {
    setFocused(f => {
      f[i] = !f[i];
      return f;
    });

    onChange(options.reduce((acc, option, i) => {
      if (focused[i]) {
        acc.push(option);
      }
      return acc;
    }, new Array()));
  }

  return (
    <ScrollView style={selectStyles.container} contentContainerStyle={selectStyles.containerContent}>
      {options.map((option, i) => (
        <TouchableWrapper key={i} focused={focused[i]} onPress={onOptionSelect(i)}>
          <View style={selectStyles.option}>
            <Text>{option}</Text>
            <Image source={focused[i]? selectedCheckbox: unselectedCheckbox} style={selectStyles.radioButton} />
          </View>
        </TouchableWrapper>
      ))}
    </ScrollView>
  );
}

