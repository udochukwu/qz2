import { Text, TouchableOpacity, PressableProps, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle } from "react-native";
import { textStyles } from "../styles";
import React from "react";

type PBProps = {
  disabled?: boolean;
  text: string;
  loadingText?: string;
  loading?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const PrimaryButton = ({ disabled, loading, text, loadingText, onPress, style, testID }: PBProps) => {
  return (
    <TouchableOpacity
      testID={testID}
      style={[styles.primaryButton, backgroundColor(loading || disabled).bgColor, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}> {loading ? loadingText : text} </Text>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  buttonText: {
    ...textStyles.nunitoFont,
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  primaryButton: {
    width: "100%",
    height: 55,
    backgroundColor: '#633CEF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const backgroundColor = (active: boolean) => StyleSheet.create({
  bgColor: {
    backgroundColor: active ? "rgba(109, 86, 250, 0.5)" : "#6D56FA"
  }
});
