import React from "react";
import { Button, StyleSheet, Text, TouchableOpacity } from "react-native";
import { textStyles } from "../styles";

type TBProps = {
  text: string;
  disabled: boolean;
  onPress: () => void;
  testID?: string;
}

export const TextButton = ({ text, onPress, disabled, testID }: TBProps) => {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={disabled}
    >
        <Text style={[styles.buttonText, disabled && styles.disabledText, !disabled && styles.textUnderline]}> {text} </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    ...textStyles.nunitoFont,
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'left',
    color:  "#302f2f",
  },
  textUnderline: {
    textDecorationLine: "underline"
  },
  disabledText: {
    color: "#8a8888",
  },
});