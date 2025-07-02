import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";
import { useState, useRef } from "react";
import { TouchableWrapper } from "../../../components/TouchableWrapper";
import { openEndendStyles } from "../styles";

type Props = {
  onChange: (text: string) => void;
  setFocused: (focus: boolean) => void;
  focused: boolean;
  text: string;
}

export const OpenEndend = ({ onChange, setFocused, focused, text }: Props) => {
  const { t } = useTranslation();
  const textInputRef = useRef(null); // Create a reference for the TextInput

  const handleWrapperPress = () => {
    setFocused(true);
    textInputRef.current?.focus();
  };

  return (
    <View style={openEndendStyles.container}>
      <TouchableWrapper focused={focused} style={openEndendStyles.wrapper} onPress={handleWrapperPress}>
        <TextInput
          ref={textInputRef} // Assign the reference to the TextInput
          multiline={true}
          placeholder={t('dynamicSurveyScreen.openEndedPlaceholder')}
          onChangeText={onChange}
          onPressIn={() => setFocused(true)}
          value={text}
        />
      </TouchableWrapper>
    </View>
  );
}
