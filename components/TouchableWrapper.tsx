import { PropsWithChildren, useState } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

type Props = {
  focused: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const TouchableWrapper = ({ children, focused, style, onPress }: PropsWithChildren<Props>) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.optionContainer, focusedStyle(focused).focused, style]}>
      <View>
        {children}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    width: "100%",
    borderRadius: 15,
    borderWidth: 2,
    padding: 10,
    height: 65,
    justifyContent: "center",
  },
})

const focusedStyle = (focused: boolean) => StyleSheet.create({
  focused: {
    backgroundColor: focused ? "#6D56FA1A" : "#fff",
    borderColor: focused ? "#6D56FA" : "#CECECE",
  }
});
